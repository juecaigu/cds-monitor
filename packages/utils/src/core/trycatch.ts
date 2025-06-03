const trycatch = (fn: () => void, errorFn?: (err?: unknown) => void) => {
  try {
    fn()
  } catch (e) {
    if (errorFn) {
      // do something like report error
      // 防止插件报错影响到主程序
      errorFn(e)
    }
  }
}

export { trycatch }
