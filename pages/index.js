import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Icon } from "@iconify/react";

const Home = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [detailCard, setDetailCard] = useState({});
  const [scroll, setScroll] = useState(1);

  //to get input value onchange
  const [searchval, setSearchval] = useState();

  //to store input value before button search pressed
  const [valSearch, setValSearch] = useState("");

  //When search button is clicked, set the valsearch value = input search value(searchval)
  const onSearch = () => {
    setValSearch(searchval);
  };
  // console.log(valSearch);
  // console.log(searchval);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY < 700;
      if (scroll !== scrollCheck) {
        setScroll(scrollCheck);
        // console.log(scrollCheck);
      }
    });
  });

  // Fetch data using SWR
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR(
    `http://www.omdbapi.com/?apikey=47e16fc6&s=${valSearch}`,
    fetcher
  );

  //error if wrong url
  if (error) return <div>failed to load</div>;
  //while waiting the data
  if (!data)
    return (
      <div
        className="text-bg-dark justify-content-center d-flex"
        style={{ lineHeight: "100vh", fontSize: "30px" }}
      >
        loading...
      </div>
    );

  //set the final respons to hasil (ready to loop)
  const hasil = data.Search;

  //when detail button on click, set modal to show(true), and set items attributes to detailcard
  const detailOnClick = (item) => {
    // console.log(item);
    const cardz = {
      id: item.imdbID,
      title: item.Title,
      year: item.Year,
      image: item.Poster,
      type: item.Type,
    };
    setShow(true);
    setDetailCard(cardz);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {scroll ? (
          console.log("masih di atas")
        ) : (
          <a href="#" className="fixed-bottom text-decoration-none me-2">
            <span className="btn-up float-end mb-5 p-1 bg-dark rounded-circle">
              <Icon icon="noto:rocket" width="50" height="50" />
            </span>
            {/* <span className="">Scroll to top</span> */}
          </a>
        )}

        <main className={styles.main}>
          <div className="row justify-content-center">
            <div className="col-md-5">
              <form className="d-flex" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search the Title"
                  aria-label="Search"
                  onChange={(e) => setSearchval(e.target.value)}
                />
                <button
                  className="btn btn-outline-success"
                  type="submit"
                  onClick={onSearch}
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          <div className="row">
            <h4 className="mt-4">
              You searched <b className="text-danger">{`"${valSearch}"`}</b>
            </h4>
          </div>
          <div className="row mt-3">
            <div className="d-flex flex-wrap gap-3">
              {!hasil ? (
                <div className="">
                  <h4 className="mt-5"> {valSearch}</h4>
                </div>
              ) : (
                hasil.map((item) => (
                  <>
                    <div
                      className="card shadow"
                      style={{ width: "16rem" }}
                      key={item.imdbID}
                    >
                      <a className="gambar" onClick={() => detailOnClick(item)}>
                        <img
                          src={item.Poster}
                          className="card-img-top"
                          style={{ cursor: "pointer" }}
                          alt="..."
                        />
                      </a>
                      <div className="card-body">
                        <h5 className="card-title">{item.Title}</h5>
                        <a
                          // href="#"
                          className="btn btn-danger"
                          onClick={() => detailOnClick(item)}
                        >
                          See Details
                        </a>

                        <Modal show={show} size="lg" onHide={handleClose}>
                          <Modal.Header closeButton>
                            <Modal.Title>
                              Title :{" "}
                              <span className="fw-bold text-danger">
                                {detailCard.title}
                              </span>
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="d-flex">
                              <img
                                src={detailCard.image}
                                width="200px"
                                height="300px"
                                alt="gmbar"
                                className=""
                              />
                              <div className="ms-4 border border-end-0 border-top-0 border-bottom-0 border-4 border-danger ps-4">
                                <p className="">
                                  <b className="fw-bold">Title : </b>
                                  {detailCard.title}
                                </p>
                                <p className="">
                                  <b className="fw-bold">Published Year : </b>
                                  {detailCard.year}
                                </p>
                                <p className="">
                                  <b className="fw-bold">Type : </b>
                                  {detailCard.type}
                                </p>
                              </div>
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="danger" onClick={handleClose}>
                              Close
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                    </div>
                  </>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
      <footer className={styles.footer}>
        <Link
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created with OMDB API{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </Link>
      </footer>
    </div>
  );
};

export default Home;
