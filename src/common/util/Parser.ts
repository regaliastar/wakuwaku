import { Token, SecenEvent, CharactarSay } from '~interface/parser';

/**
 * 词法分析，分割词素，生成 Token 串
 * 要求剧本为 LL(1) 文法，First 集合交集必须为空
 */
const Scanner = (text: string): Array<Token> => {
  const recognizeBg = (line: string): Token | false => {
    if (line.substring(0, 3) === '>bg' && line.substring(0, 4) !== '>bgm') {
      const arr = line.includes(':') ? line.split(':') : line.split('：');
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
    if (line.substring(0, 4) === '>bgm') {
      const arr = line.includes(':') ? line.split(':') : line.split('：');
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
    if (line.substring(0, 6) === '>voice') {
      const arr = line.includes(':') ? line.split(':') : line.split('：');
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
    const line = _line.trim();
    // filter
    if (line === '') return;
    if (line[0] === '/' && line[1] === '/') return;

    if (line[0] === '>') {
      const res = recognizeBg(line) || recognizeBgm(line) || recognizeVoice(line);
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
  return tokens;
};

/**
 * 语法分析，根据 Token 串生成指令，将可合并的指令组合在一起，生成事件；
 * 事件是指令的集合，比如，切换 bg 与人物说话属于同一个事件，可以并行执行。事件使用二维数组表示；
 * 后续还将对事件进行优化，比如在同一个事件内，切换 bg 只有最后一次生效...工作量好大，召唤爱莉希雅帮我优化！
 * 要求剧本遵循 LL(1) 文法
 */
const Parser = (tokens: Token[]): SecenEvent[][] => {
  // 在同一个事件中，只能存在一个不可组合指令。默认 say、aside 类型事件需要交互（点击）
  const cannotCombindInstruction = ['say', 'sperateEvent', 'aside'];
  const instructions: SecenEvent[] = [];
  const EOF = '$';
  let current = -1;
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

  const matchAddCharactor = (curToken: Token): SecenEvent | false => {
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

  const matchSay = (curToken: Token): SecenEvent | false => {
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

  while (lookahead !== EOF) {
    if (lookahead.type === 'bg') {
      instructions.push({
        type: 'bgChange',
        value: lookahead.value,
      });
    } else if (lookahead.type === 'bgm') {
      instructions.push({
        type: 'bgmChange',
        value: lookahead.value,
      });
    } else if (lookahead.type === 'voice') {
      instructions.push({
        type: 'voiceChange',
        value: lookahead.value,
      });
    } else if (lookahead.type === 'aside') {
      instructions.push({
        type: 'aside',
        value: lookahead.value,
      });
    } else if (lookahead.type === 'sperator') {
      instructions.push({
        type: 'sperateEvent',
        value: lookahead.value,
      });
    } else if (lookahead.type === 'addCharactorName') {
      const res = matchAddCharactor(lookahead);
      if (res !== false) {
        instructions.push(res);
      }
    } else if (lookahead.type === 'sayName') {
      const res = matchSay(lookahead);
      if (res !== false) {
        instructions.push(res);
      }
    }
    lookahead = getNextToken();
  }

  // 组合可并行指令生成事件
  let events: SecenEvent[][] = [];
  instructions.forEach(inst => {
    if (events.length > 0 && events[events.length - 1].every(e => !cannotCombindInstruction.includes(e.type))) {
      events[events.length - 1].push(inst);
      return;
    }
    events.push([inst]);
  });
  events = events.map(event => {
    return event.filter(e => e.type !== 'sperateEvent');
  });

  return events;
};

export { Scanner, Parser };
