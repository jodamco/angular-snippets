export function queryAnalyticByDate<T>(fn, params): Promise<T> {
  return new Promise((resolve, reject) => {
    fn(...params, (error, data) => {
      if (error) reject(error);
      resolve(data);
    });
  });
}
