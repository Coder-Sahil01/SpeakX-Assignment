import React from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Loader from "../components/Loader";

export default function HomePage() {
  const [data, setData] = React.useState([]);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTitle, setSearchTitle] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = React.useState({});

  const fetchData = async (page = 1, title = "") => {
    try {
      setLoading(true);
      const response = await axios.get("https://backendspeakx.vercel.app/", {
        params: { page, title },
      });
      console.log(response.data.data);

      setData(response.data.data);
      setTotalRecords(response.data.totalRecords);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    fetchData(selectedPage, searchTitle);
    window.scrollTo(0, 0);
  };

  const handleSearch = () => {
    fetchData(1, searchTitle);
  };

  const handleOptionClick = (questionId, optionIndex, isCorrect) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [questionId]: { optionIndex, isCorrect },
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="mb-4 w-full max-w-md flex">
        <input
          type="text"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          placeholder="Search by title"
          className="border p-2 w-full rounded-l"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-500 text-white rounded-r transition-transform transform hover:scale-105"
        >
          🔍
        </button>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="sm:w-full md:max-w-4xl">
          {data.map((question) => (
            <div key={question._id} className="p-4 my-4 shadow rounded ">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">{question.title}</h2>
                <span
                  className={`px-2 text-sm py-1 rounded text-white ${
                    question.type === "ANAGRAM" ? "bg-green-500" : "bg-blue-500"
                  }`}
                >
                  {question.type}
                </span>
              </div>
              {question.type === "ANAGRAM" && question.blocks && (
                <div className="flex flex-wrap">
                  {question.blocks.map((block, index) => (
                    <div key={index} className="p-2 m-1 border rounded">
                      {block.text}
                    </div>
                  ))}
                </div>
              )}
              {question.type === "MCQ" && question.options && (
                <ul className="list-disc pl-5">
                  {question.options.map((option, index) => (
                    <li
                      key={index}
                      onClick={() =>
                        handleOptionClick(question._id, index, option.isCorrectAnswer)
                      }
                      className={`cursor-pointer p-2 rounded ${
                        selectedOptions[question._id]?.optionIndex === index
                          ? selectedOptions[question._id].isCorrect
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                          : ""
                      }`}
                    >
                      {option.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={Math.ceil(totalRecords / 15)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        onPageChange={handlePageClick}
        containerClassName={"pagination flex justify-center mt-4 space-x-2"}
        activeClassName={"active"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link px-3 py-1 border rounded hover:bg-blue-500 hover:text-white"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link px-3 py-1 border rounded hover:bg-blue-500 hover:text-white"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link px-3 py-1 border rounded hover:bg-blue-500 hover:text-white"}
        breakLinkClassName={"page-link px-3 py-1 border rounded"}
      />
    </div>
  );
}