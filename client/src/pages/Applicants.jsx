import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import { FaSearch, FaRegBookmark, FaBookmark, FaSort } from "react-icons/fa";

const TABLE_HEAD = [
  "Starred",
  "Job Title",
  "Name",
  "Email",
  "Resume",
  "Status",
];
const api = axios.create({ baseURL: "http://3.106.192.156:8080", withCredentials: true });

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shortlistedIds, setShortlistedIds] = useState(new Set());
  const [isSortedByFavorites, setIsSortedByFavorites] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [employerId, setEmployerId] = useState(null);
  const [resumesLoaded, setResumesLoaded] = useState(false);

  const recordPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / recordPerPage);
  const recordsOnCurrentPage = filteredData.slice(
    (currentPage - 1) * recordPerPage,
    currentPage * recordPerPage
  );

  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchEmployerId = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/employer/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployerId(response.data.employerId);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token && userId) {
      fetchEmployerId();
    }
  }, [token, userId]);

  useEffect(() => {
    if (!employerId) return;

    setLoading(true);
    setDataFetched(false);

    api
      .get(`/employer/shortlists?employerId=${employerId}`)
      .then((res) => {
        const ids = new Set(res.data.map((item) => item.jobSeekerId));
        setShortlistedIds(ids);
      })
      .catch(console.error);

    api
      .get(`/employer/applicants?employerId=${employerId}`)
      .then((res) => {
        setApplicants(res.data);
        setFilteredData(res.data);
        setDataFetched(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [employerId]);

  useEffect(() => {
    if (applicants.length === 0 || resumesLoaded) return;

    const fetchResumes = async () => {
      const updated = await Promise.all(
        applicants.map(async (app) => {
          try {
            const res = await api.get(
              `/employee/resumes/jobseeker/${app.jobSeekerId}`
            );
            return { ...app, resumeUrl: res.data.resumeUrl };
          } catch (err) {
            if (err.response?.status !== 404) {
              console.warn(
                `Resume fetch error for ${app.jobSeekerId}:`,
                err.message
              );
            }
            return { ...app, resumeUrl: null };
          }
        })
      );
      setApplicants(updated);
      setFilteredData(updated);
      setResumesLoaded(true);
    };

    fetchResumes();
  }, [applicants, resumesLoaded]);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = applicants.filter((applicant) =>
      `${applicant.firstName} ${applicant.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(`/employer/applications/${applicationId}/status`, {
        status: newStatus,
      });
      setApplicants((prev) =>
        prev.map((app) =>
          app.applicationId === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );
      setFilteredData((prev) =>
        prev.map((app) =>
          app.applicationId === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async (jobSeekerId) => {
    const pcId = `${employerId}_${jobSeekerId}`;
    if (shortlistedIds.has(jobSeekerId)) {
      try {
        await api.delete(`/employer/shortlists/${pcId}`);
        setShortlistedIds((prev) => {
          const updated = new Set(prev);
          updated.delete(jobSeekerId);
          return updated;
        });
      } catch (err) {
        console.error("Failed to remove bookmark!");
      }
    } else {
      try {
        await api.post(`/employer/shortlists`, { employerId, jobSeekerId });
        setShortlistedIds((prev) => new Set(prev).add(jobSeekerId));
      } catch (err) {
        console.error("Failed to bookmark!");
      }
    }
  };

  const handleSortByFavorites = () => {
    if (isSortedByFavorites) {
      setFilteredData(applicants);
    } else {
      const sorted = [...filteredData].sort(
        (a, b) =>
          Number(shortlistedIds.has(b.jobSeekerId)) -
          Number(shortlistedIds.has(a.jobSeekerId))
      );
      setFilteredData(sorted);
    }
    setIsSortedByFavorites(!isSortedByFavorites);
  };

  const toNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const toPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading || !dataFetched) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center text-gray-500 py-8 text-lg">
          Loading applicants, please wait...
        </div>
      </div>
    );
  }

  return (
    <Card className="min-h-screen flex justify-center item-center shadow-none rounded-none">
      <div className="w-full max-w-6xl mx-auto">
        <CardHeader floated={false} shadow={false} className="p-0 mb-4">
          <div className="text-center pt-12 pb-6 mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-800">
              View Applicants
            </h2>
            <div className="mx-auto mt-2 w-16 border-b-2 border-blue-500"></div>
          </div>
          <form
            onSubmit={handleSearch}
            className="flex items-center w-2/3 sm:w-auto sm:justify-end justify-center mx-auto"
          >
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-400 focus:ring-1 focus:outline-none focus:border-gray-400 w-full sm:w-[300px] p-2.5 placeholder:text-gray-400"
              placeholder="Search for applicant names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              <FaSearch />
              <span className="sr-only">Search</span>
            </button>
          </form>
        </CardHeader>

        <CardBody className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto text-sm text-center">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-b border-gray-300 bg-gray-200 p-4 whitespace-nowrap"
                    >
                      <Typography
                        variant="small"
                        className="font-bold text-black text-1xl leading-none opacity-70"
                      >
                        {head === "Starred" ? (
                          <span
                            className="flex items-center cursor-pointer"
                            onClick={handleSortByFavorites}
                          >
                            Starred
                            <FaSort
                              className={
                                isSortedByFavorites
                                  ? "text-red-500 ms-1"
                                  : "text-black ms-1"
                              }
                            />
                          </span>
                        ) : (
                          head
                        )}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recordsOnCurrentPage.length > 0 ? (
                  recordsOnCurrentPage.map((data) => (
                    <tr key={data.applicationId} className="even:bg-gray-100">
                      <td className="p-4 text-center align-middle">
                        <button
                          onClick={() => handleBookmark(data.jobSeekerId)}
                          className="flex justify-center w-full"
                        >
                          {shortlistedIds.has(data.jobSeekerId) ? (
                            <FaBookmark className="text-red-400" />
                          ) : (
                            <FaRegBookmark />
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-center align-middle">
                        {data.title}
                      </td>
                      <td className="p-4 text-center align-middle">
                        {`${data.firstName} ${data.lastName}`}
                      </td>
                      <td className="p-4 text-center align-middle">
                        {data.email}
                      </td>
                      <td className="p-4 text-center align-middle">
                        {data.resumeUrl ? (
                          <a
                            href={data.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800 block"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-gray-400 italic block">
                            No Resume Link
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center align-middle">
                        <select
                          value={data.status}
                          className="p-2 bg-gray-100 rounded-md text-sm"
                          onChange={(e) =>
                            handleStatusChange(
                              data.applicationId,
                              e.target.value
                            )
                          }
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Interview">Interview</option>
                          <option value="Interviewed">Interviewed</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={TABLE_HEAD.length}
                      className="text-center p-10"
                    >
                      No applicants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>

        <CardFooter className="border-t border-blue-gray-50 p-0 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between justify-center gap-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal text-center"
            >
              Page {currentPage} of {totalPages}
            </Typography>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outlined"
                size="sm"
                onClick={toPrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                size="sm"
                onClick={toNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default Applicants;
