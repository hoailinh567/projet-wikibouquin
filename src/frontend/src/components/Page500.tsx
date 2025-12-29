function Page500() {
  return (
      <div className="p-5 grid h-full place-items-center text-center min-h-[400px]">
        <div>
          <img
            src="/error500.jpg"
            alt="error500"
            className="mx-auto w-48 h-48 md:w-64 md:h-64 object-contain mb-4"
          />
          <p className="text-xl font-semibold text-red-500">
            Une problème est survenue, veuillez réessayer plus tard ! Merci pour votre compréhension. 
          </p>
        </div>
      </div>
    );
}

export default Page500;