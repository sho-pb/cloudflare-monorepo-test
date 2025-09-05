export const Post = async () => {
  const data = (await fetch(
    'https://jsonplaceholder.typicode.com/posts/1'
  ).then((response) => response.json())) as
    | {
        id: number;
        userId: number;
        title: string;
        body: string;
      }
    | undefined;

  await new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));

  return <div>{data?.title}</div>;
};
