import { Token, Instruction, CharactarSay } from '~interface/parser';
import { groupEvent } from '~util/common';

/**
 * 词法分析，分割词素，生成 Token 串
 * 要求剧本为 LL(1) 文法，First 集合交集必须为空
 */
const Scanner = (text: string): Array<Token> => {
  const LabelDict: string[] = [];

  const recognizeBg = (line: string): Token | false => {
    if (line.substring(0, 3) === '/bg' && line.substring(0, 4) !== '/bgm') {
      const arr = line.split(' ');
      if (arr.length !== 2) {
        return false;
      }
      return {
        type: 'bg',
        value: arr[1].trim(),
      };
    }
    return false;
  };

  const recognizeBgm = (line: string): Token | false => {
    if (line.substring(0, 4) === '/bgm') {
      const arr = line.split(' ');
      if (arr.length !== 2) {
        return false;
      }
      return {
        type: 'bgm',
        value: arr[1].trim(),
      };
    }
    return false;
  };

  const recognizeVoice = (line: string): Token | false => {
    if (line.substring(0, 6) === '/voice') {
      const arr = line.split(' ');
      if (arr.length !== 2) {
        return false;
      }
      return {
        type: 'voice',
        value: arr[1].trim(),
      };
    }
    return false;
  };

  const recognizeIf = (line: string): Token | false => {
    if (line.substring(0, 3) === '/if') {
      const arr = line.split(' ');
      if (arr[0] !== '/if') return false;
      const str = line.substring(3).trim();
      const [text, label] = str.includes(':') ? str.split(':') : str.split('：');
      LabelDict.push(label.trim());
      return {
        type: 'if',
        value: {
          text: text.trim(),
          label: label.trim(),
        },
      };
    }
    return false;
  };

  const recognizeLabel = (line: string): Token | false => {
    const str = line.replace(/:/g, '').trim();
    const index = LabelDict.findIndex(l => l === str);
    if (index === -1) return false;
    return {
      type: 'label',
      value: str,
    };
  };

  const recognizeAddCharactor = (line: string): Token[] | false => {
    if (line[0] === '+') {
      const str = line.substring(1).trim();
      const charactors = str.includes('，') ? str.split('，') : str.split(',');
      return charactors.map((ch): Token => {
        return {
          type: 'addCharactorName',
          value: ch.trim(),
        };
      });
    }
    return false;
  };

  const recognizeSay = (line: string): Token[] | false => {
    if (line.includes(':') || line.includes('：')) {
      const arr = line.includes(':') ? line.split(':') : line.split('：');
      if (arr.length !== 2) {
        return false;
      }
      return [
        {
          type: 'sayName',
          value: arr[0].trim(),
        },
        {
          type: 'text',
          value: arr[1].trim(),
        },
      ];
    }
    return false;
  };

  // 适配 windows txt 文本以 \r\n 结尾
  const lines = text.replace(/\r/g, '').trim().split('\n');
  let tokens: Array<Token> = [];
  lines.forEach(_line => {
    const line = _line.trim().replace(/\s{2,}/g, ' ');
    // filter
    if (line === '') return;
    if (line[0] === '/' && line[1] === '/') return;

    if (line[0] === '/') {
      const res = recognizeBg(line) || recognizeBgm(line) || recognizeVoice(line) || recognizeIf(line);
      if (res) {
        tokens.push(res);
        return;
      }
    }
    if (line[0] === '+') {
      const chs = recognizeAddCharactor(line);
      if (chs !== false) {
        tokens = tokens.concat(chs);
        return;
      }
    }
    if (line[0] === '-') {
      tokens.push({
        type: 'sperator',
        value: '',
      });
      return;
    }
    const labelRes = recognizeLabel(line);
    if (labelRes !== false) {
      tokens = tokens.concat(labelRes);
      return;
    }
    // 排除是指令的情况后，剩下的可能有：角色说话、旁白
    const sayRes = recognizeSay(line);
    if (sayRes !== false) {
      tokens = tokens.concat(sayRes);
      return;
    }
    // 如果不是角色说话，那么认为是旁白
    tokens.push({
      type: 'aside',
      value: line,
    });
  });
  // console.log('Scanner', tokens);
  return tokens;
};

/**
 * 语法分析，根据 Token 串生成指令，将可合并的指令组合在一起，生成事件；
 * 事件是指令的集合，比如，切换 bg 与人物说话属于同一个事件，可以并行执行。事件使用二维数组表示；
 * 后续还将对事件进行优化，比如在同一个事件内，切换 bg 只有最后一次生效...工作量好大，召唤爱莉希雅帮我优化！
 * 要求剧本遵循 LL(1) 文法
 */
const Parser = (tokens: Token[]): Instruction[][] => {
  const instructions: Instruction[] = [];
  const EOF = '$';
  let current = -1;
  const LabelDict: string[] = [];
  const getNextToken = (): typeof EOF | Token => {
    current += 1;
    if (current >= tokens.length) {
      return EOF;
    }
    return tokens[current];
  };
  const goBack = () => {
    if (current >= 1) {
      current -= 1;
    }
  };
  let lookahead = getNextToken();

  const matchAddCharactor = (curToken: Token): Instruction | false => {
    const names: string[] = [];
    if (curToken.type === 'addCharactorName') {
      while (lookahead !== EOF && lookahead.type === 'addCharactorName') {
        names.push(lookahead.value as string);
        lookahead = getNextToken();
      }
      goBack();
      return {
        type: 'charactorChange',
        value: names,
      };
    }
    return false;
  };

  const matchSay = (curToken: Token): Instruction | false => {
    const lookahead = getNextToken();
    if (curToken.type === 'sayName' && lookahead !== EOF && lookahead.type === 'text') {
      return {
        type: 'say',
        value: {
          name: curToken.value,
          text: lookahead.value,
        } as CharactarSay,
      };
    }
    return false;
  };

  const matchIf = (curToken: Token): Instruction | false => {
    if (curToken.type === 'if') {
      const cont = [];
      while (lookahead !== EOF && lookahead.type === 'if') {
        LabelDict.push(lookahead.value.label);
        cont.push({ text: lookahead.value.text, label: lookahead.value.label });
        lookahead = getNextToken();
      }
      goBack();
      return {
        type: 'if',
        value: cont,
      };
    }
    return false;
  };

  const matchLabel = (curToken: Token): Instruction | false => {
    if (curToken.type === 'label') {
      const startLabel = curToken.value as string;
      const innerInst = [];
      lookahead = getNextToken();
      while (lookahead !== EOF && lookahead.type !== 'label') {
        switch (lookahead.type) {
          case 'bg':
            innerInst.push({
              type: 'bgChange',
              value: lookahead.value,
            });
            break;
          case 'bgm':
            innerInst.push({
              type: 'bgmChange',
              value: lookahead.value,
            });
            break;
          case 'voice':
            innerInst.push({
              type: 'voiceChange',
              value: lookahead.value,
            });
            break;
          case 'aside':
            innerInst.push({
              type: 'aside',
              value: lookahead.value,
            });
            break;
          case 'sperator':
            innerInst.push({
              type: 'sperateEvent',
              value: lookahead.value,
            });
            break;
          case 'addCharactorName': {
            const res = matchAddCharactor(lookahead);
            if (res !== false) {
              innerInst.push(res);
            }
            break;
          }
          case 'sayName': {
            const res = matchSay(lookahead);
            if (res !== false) {
              innerInst.push(res);
            }
            break;
          }
          default:
        }
        lookahead = getNextToken();
      }
      if (lookahead === EOF) {
        throw new Error('不能以label作为脚本结尾');
      }
      if (lookahead.type === 'label' && lookahead.value !== startLabel) {
        throw new Error(`label必须前后一致 ${startLabel} ${lookahead.value}`);
      }
      return {
        type: 'label',
        value: {
          instructions: innerInst as Instruction[],
          label: startLabel,
        },
      };
    }
    return false;
  };

  while (lookahead !== EOF) {
    switch (lookahead.type) {
      case 'bg':
        instructions.push({
          type: 'bgChange',
          value: lookahead.value,
        });
        break;
      case 'bgm':
        instructions.push({
          type: 'bgmChange',
          value: lookahead.value,
        });
        break;
      case 'voice':
        instructions.push({
          type: 'voiceChange',
          value: lookahead.value,
        });
        break;
      case 'aside':
        instructions.push({
          type: 'aside',
          value: lookahead.value,
        });
        break;
      case 'sperator':
        instructions.push({
          type: 'sperateEvent',
          value: lookahead.value,
        });
        break;
      case 'addCharactorName': {
        const res = matchAddCharactor(lookahead);
        if (res !== false) {
          instructions.push(res);
        }
        break;
      }
      case 'sayName': {
        const res = matchSay(lookahead);
        if (res !== false) {
          instructions.push(res);
        }
        break;
      }
      case 'if': {
        const res = matchIf(lookahead);
        if (res !== false) {
          instructions.push(res);
        }
        break;
      }
      case 'label': {
        const res = matchLabel(lookahead);
        if (res !== false) {
          instructions.push(res);
        }
        break;
      }
      default:
    }
    lookahead = getNextToken();
  }

  return groupEvent(instructions);
};

export { Scanner, Parser };
