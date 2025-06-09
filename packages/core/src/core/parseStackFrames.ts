import { StackFrames } from '@cds-monitor/type';
/** 正则表达式，用以解析堆栈split后得到的字符串 */
const FULL_MATCH =
  /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;

/**
 * 解析行
 * @param line
 * @returns
 */
export const parseStackLine = (line: string): StackFrames | null => {
  const lineMatch = line.match(FULL_MATCH);
  if (!lineMatch) return null;
  const filename = lineMatch[2] || '';
  const functionName = lineMatch[1] || '';
  const lineno = parseInt(lineMatch[3], 10) || undefined;
  const colno = parseInt(lineMatch[4], 10) || undefined;
  return {
    filename,
    functionName,
    lineno,
    colno,
  };
};

/**
 * 解析错误堆栈
 * @param error
 * @returns
 */
const parseStackFrames = (error: Error, limit = 5) => {
  if (!(error && error.stack)) return [];
  const { stack } = error;
  const frames: StackFrames[] = [];
  for (const line of stack.split('\n').slice(1)) {
    const frame = parseStackLine(line);
    if (frame) {
      frames.push(frame);
    }
  }
  return frames.slice(0, limit);
};

export { parseStackFrames };
