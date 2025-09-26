export const dynamic = 'force-dynamic';

export const Post = async () => {
  const postId = Math.floor(Math.random() * 10) + 1;

  const data = (await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  ).then((response) => response.json())) as
    | {
        id: number;
        userId: number;
        title: string;
        body: string;
      }
    | undefined;

  await new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));

  return (
    <div>
      {postId}:{data?.id}:{data?.title}
    </div>
  );
};
