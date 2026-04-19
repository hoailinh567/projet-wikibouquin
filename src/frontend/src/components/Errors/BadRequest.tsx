function BadRequest({ message }: { message?: string }) {
    return (
        <div className="p-4 md:p-5 grid h-full place-items-center text-center">
            <div>
                <img
                    src="/error400.jpg"
                    className="mx-auto w-40 h-40 md:w-70 md:h-70 object-contain mb-4"
                    alt="Erreur 400"
                />
                <p className="text-base md:text-xl font-semibold">{message}</p>
            </div>
        </div>
    );
}

export default BadRequest;