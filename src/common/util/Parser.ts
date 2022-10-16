import { Token, SecenEvent, CharactarSay } from '~interface/index';

const Scanner = (text: string): Array<Token> => {
  const recognizeBg = (line: string): Token | false => {
    if (line.substring(0, 3) === '>bg') {
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

  const recognizeMusic = (line: string): Token | false => {
    if (line.substring(0, 6) === '>music') {
      const arr = line.includes(':') ? line.split(':') : line.split('：');
      if (arr.length !== 2) {
        return false;
      }
      return {
        type: 'music',
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
  let token: Array<Token> = [];
  lines.forEach(_line => {
    const line = _line.trim();
    let isSuccess = false;
    // filter
    if (line === '') return;
    if (line[0] === '/' && line[1] === '/') return;

    if (line[0] === '>') {
      const value = recognizeBg(line) || recognizeMusic(line);
      if (value) {
        token.push(value);
        isSuccess = true;
      }
    }
    if (line[0] === '+') {
      const chs = recognizeAddCharactor(line);
      if (chs !== false) {
        token = token.concat(chs);
        isSuccess = true;
      }
    }
    if (!isSuccess) {
      const res = recognizeSay(line);
      if (res !== false) {
        token = token.concat(res);
        isSuccess = true;
      }
    }
    token.push({
      type: 'sperator',
      value: '',
    });
    if (!isSuccess) {
      throw new Error(`无法解析的文本: ${line}`);
    }
  });
  return token;
};

// 根据 token 生成事件串
const Parser = (tokens: Token[]): SecenEvent[] => {
  const event: SecenEvent[] = [];
  const EOF = '$';
  let current = -1;
  const getNextToken = (): typeof EOF | Token => {
    current += 1;
    if (current >= tokens.length) {
      return EOF;
    }
    return tokens[current];
  };
  let lookahead = getNextToken();

  const matchAddCharactor = (curToken: Token): SecenEvent | false => {
    const names: string[] = [];
    if (curToken.type === 'addCharactorName') {
      while (lookahead !== EOF && lookahead.type === 'addCharactorName') {
        names.push(lookahead.value as string);
        lookahead = getNextToken();
      }
      return {
        type: 'addCharactor',
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
      event.push({
        type: 'bgChange',
        value: lookahead.value,
      });
    } else if (lookahead.type === 'music') {
      event.push({
        type: 'musicChange',
        value: lookahead.value,
      });
    } else if (lookahead.type === 'addCharactorName') {
      const res = matchAddCharactor(lookahead);
      if (res !== false) {
        event.push(res);
      }
    } else if (lookahead.type === 'sayName') {
      const res = matchSay(lookahead);
      if (res !== false) {
        event.push(res);
      }
    }
    lookahead = getNextToken();
  }
  return event;
};

export { Scanner, Parser };
