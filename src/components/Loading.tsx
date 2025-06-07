export default function Loading() {
  return (
    <div className='flex w-full h-full text-center'>
      <div className='flex flex-col justify-center items-center gap-4 m-auto'>
        <span className='loader'></span>
        Loading...
      </div>
    </div>
  );
}
