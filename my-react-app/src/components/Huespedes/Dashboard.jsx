import Sidebar from "../Dashboard/Sidebar";
import Header from "../Dashboard/Header";
import ReservationProcess from "../Huespedes/ReservationProcess";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-white p-6 shadow-lg rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Mi reserva</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <img
                    src="/casa.jpg"
                    alt="Living Room"
                    className="rounded-md w-full h-48 object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <img
                    src="/salon.jpg"
                    alt="Room"
                    className="rounded-md h-24 object-cover"
                  />
                  <img
                    src="/cama.jpg"
                    alt="Room"
                    className="rounded-md h-24 object-cover"
                  />
                  <img
                    src="/habitación.jpg"
                    alt="Room"
                    className="rounded-md h-24 object-cover"
                  />
                  <img
                    src="/dormitorio.jpg"
                    alt="Room"
                    className="rounded-md h-24 object-cover"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-6 shadow-lg rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Últimas reservas</h2>
              <p>
                kjsdkjc bjsndsbmsb, djbshfseafkaebdab, jsdbajbe, jfbe, janwkand.
                efne, an, kdne, jn, aefnf kae. nfe. kanf. akfna eifthe uafb
                iwurbf ewef
              </p>
              <p>
                kjsdkjc bjsndsbmsb, djbshfseafkaebdab, jsdbajbe, jfbe, janwkand.
                efne, an, kdne, jn, aefnf kae. nfe. kanf. akfna eifthe uafb
                iwurbf ewef
              </p>
            </section>

            <section className="lg:col-span-2 bg-white p-6 shadow-lg rounded-lg">
              <ReservationProcess />
            </section>

            <section className="bg-white p-6 shadow-lg rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Gloove points</h2>
              <div className="flex items-center space-x-4">
                <span className="bg-yellow-400 text-white px-4 py-2 rounded-md">
                  POINT
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
