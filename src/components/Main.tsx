export default function Main() {
  return (
    <div className='flex flex-col md:flex-row justify-center items-stretch gap-6 bg-black bg-opacity-70 p-8 text-white min-h-[300px]'>
      {/* Events Section */}
      <div className='flex-1 p-6 rounded-xl hover:bg-opacity-80 transition shadow-md'>
        <h2 className='text-2xl font-semibold mb-2'>Events</h2>
        <p className='text-gray-300'>
          Discover the most anticipated shows of the season — curated just for
          you.
        </p>
      </div>

      {/* Tickets Section */}
      <div className='flex-1 p-6 rounded-xl hover:bg-opacity-80 transition shadow-md'>
        <h2 className='text-2xl font-semibold mb-2'>Tickets</h2>
        <p className='text-gray-300'>
          Secure your seat before they sell out. Choose your experience tier
          now.
        </p>
      </div>

      {/* Experience Section */}
      <div className='flex-1 p-6 rounded-xl hover:bg-opacity-80 transition shadow-md'>
        <h2 className='text-2xl font-semibold mb-2'>Experience</h2>
        <p className='text-gray-300'>
          Get immersed in sound, lights, and unforgettable energy. It's more
          than music.
        </p>
      </div>
    </div>
  );
}
