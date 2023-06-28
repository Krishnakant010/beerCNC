// import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import Place from "../components/Place";

const Places = () => {
  const { action } = useParams();
  const navigate = useNavigate();
  let fname;
  async function uploadPic(e) {
    const files = e.target.files;
    console.log({ files });
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    console.log({ data });
    axios
      .post("/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        const filename = res.data;
        fname = filename;
        setAddedPhotos((prev) => {
          return [...prev, filename];
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // // E
  }
  const [form, setform] = useState({
    title: "",
    address: "",
    imglink: "",
    description: "",
    wifi: "",
    parking: "",
    tv: "",
    pets: "",
    entrance: "",
    extrainfo: "",
    checkin: "",
    checkout: "",
    guests: "",
  });

  const [addedPhotos, setAddedPhotos] = useState([]);
  function changeHandler(e) {
    const { name, value, checked, type } = e.target;
    setform((prev) => {
      return {
        ...prev,

        [name]: type === "checkbox" ? checked : value,
      };
    });
  }
  async function addPhotoByLink() {
    const { data } = await axios
      .post("/upload-by-link", {
        link: form.imglink,
      })
      .catch((e) => {
        toast.error(e.message);
      });
    setAddedPhotos((prev) => {
      return [...prev, data];
    });
    setform({
      imglink: "",
    });
    console.log(data);
  }
  const [effector, setEffector] = useState(false);
  async function submitHandler(e) {
    e.preventDefault();
    // console.log(form);
    const res = axios.post("/places", { form, addedPhotos });
    console.log(res);
    setEffector(true);
    navigate("/account/places");
  }

  const [places, setPlaces] = useState([]);
  // Get places
  // s
  // --------------------------------
  // --------------------------------**!SECT----------------------\n
  useEffect(() => {
    axios.get("/places").then(({ data }) => {
      setPlaces(data);
      console.log(data);
    });
  }, [form]);

  return (
    <>
      <div className="text-center">
        {action !== "new" && (
          <>
            {" "}
            <Link
              className=" inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
              to={"/account/places/new"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 01.878.645 49.17 49.17 0 01.376 5.452.657.657 0 01-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 00-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 01-.595 4.845.75.75 0 01-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 01-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 01-.658.643 49.118 49.118 0 01-4.708-.36.75.75 0 01-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 005.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82.75.75 0 01.83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 00.657-.642z" />
              </svg>
              Add new Place
            </Link>
            <Place places={places} />
          </>
        )}
      </div>
      {action === "new" && (
        <div>
          <form onSubmit={submitHandler}>
            <h2 className="text-2xl mt4">Title</h2>
            <p className="text-gray-500 text-sm">title for your place.</p>
            <input
              type="text"
              onChange={changeHandler}
              name="title"
              value={form.title}
              placeholder="title eg: My apt"
            />
            <h2 className="text-2xl mt4">Adress</h2>
            <p className="text-gray-500 text-sm">Adress for your place.</p>
            <input
              type="text"
              name="address"
              onChange={changeHandler}
              value={form.address}
              placeholder="address"
            />
            <h2 className="text-2xl mt4">Photos</h2>
            <p className="text-gray-500 text-sm">More = better</p>
            <div className="flex gap-2">
              <input
                type="text"
                name="imglink"
                onChange={changeHandler}
                value={form.imglink}
                placeholder="add using link ...jpg"
              />
              <button
                onClick={addPhotoByLink}
                className="bg-gray-200 grwo px-4 rounded-xl"
              >
                Add&nbsp;photo
              </button>
            </div>

            <div className="h-32  mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {addedPhotos.length > 0 &&
                addedPhotos?.map((link, idx) => (
                  <div className="h-32 flex " key={idx}>
                    <img
                      className=" rounded-2xl w-full object-cover   "
                      src={`http://localhost:4000/uploads/${link}`}
                    />
                  </div>
                ))}
              <label className="inline-flex items-center justify-center gap-1 border bg-transparent rounded-2xl  text-2xl text-gray-700">
                <input
                  type="file"
                  name="foo"
                  id="myFiles"
                  accept="image/*"
                  className="hidden "
                  onChange={uploadPic}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75"
                  />
                </svg>
                Upload
              </label>
            </div>
            <h2 className="text-2xl mt4">Description</h2>
            <p className="text-gray-500 text-sm">Description of text </p>
            <textarea
              name="description"
              onChange={changeHandler}
              value={form.description}
            />
            <h2 className="text-2xl mt4">Perks</h2>
            <p className="text-gray-500 text-sm">Select perks of your place </p>
            <div className="grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mt-2">
              <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer  ">
                <input
                  type="checkbox"
                  name="wifi"
                  onChange={changeHandler}
                  value={form.wifi}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
                  />
                </svg>

                <span>Wifi</span>
              </label>
              <label className="border p-4 flex rounded-2xl gap-2 items-center  cursor-pointer">
                <input
                  type="checkbox"
                  name="parking"
                  onChange={changeHandler}
                  value={form.parking}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>

                <span>Free Parking</span>
              </label>
              <label className="border p-4 flex rounded-2xl gap-2 items-center  cursor-pointer ">
                <input
                  type="checkbox"
                  name="tv"
                  onChange={changeHandler}
                  value={form.tv}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
                  />
                </svg>

                <span>Tv</span>
              </label>
              <label className="border p-4 flex rounded-2xl gap-2  cursor-pointer items-center ">
                <input
                  type="checkbox"
                  name="pets"
                  onChange={changeHandler}
                  value={form.pets}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                  />
                </svg>

                <span>Pets</span>
              </label>
              <label className="border p-4 flex rounded-2xl gap-2 items-center   cursor-pointer ">
                <input
                  type="checkbox"
                  name="entrance"
                  onChange={changeHandler}
                  value={form.entrance}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>

                <span>Entrance</span>
              </label>
            </div>
            <h2 className="text-2xl mt4">Extra info</h2>
            <p className="text-gray-500 text-sm">house rules, etc</p>
            <textarea
              name="extrainfo"
              id="extrainfo"
              cols="30"
              rows="10"
              onChange={changeHandler}
              value={form.extrainfo}
            ></textarea>
            <h2 className="text-2xl mt4">Check in&out times, max guest </h2>
            <p className="text-gray-500 text-sm">
              add check in and out times ,remember to add time window for
              cleaning
            </p>
            <div className="grid sm:grid-cols-3 gap-2 ">
              <div>
                <h3 className="nt-2 -mb-1">Check in time</h3>
                <input
                  type="text"
                  name="checkin"
                  placeholder="14:00"
                  onChange={changeHandler}
                  value={form.checkin}
                />
              </div>
              <div>
                <h3 className="nt-2 -mb-1">Check out time</h3>
                <input
                  type="text"
                  name="checkout"
                  onChange={changeHandler}
                  value={form.checkout}
                />
              </div>
              <div>
                <h3 className="nt-2 -mb-1">Max number of guests</h3>
                <input
                  type="number"
                  name="guests"
                  onChange={changeHandler}
                  value={form.guests}
                />
              </div>
            </div>
            <div>
              <button className="primary my-4" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Places;
