import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardBody, CardFooter, Button, Typography } from '@material-tailwind/react';
import { FaSearch, FaRegBookmark, FaBookmark, FaSort } from 'react-icons/fa';
import ApplicantData from '../dummyData/ApplicantData';

const TABLE_HEAD = ["Starred", "Name", "Job Title", "Resume", "Status"]

const Applicants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [originalData] = useState(ApplicantData);
  const [filteredData, setFilteredData] = useState(ApplicantData);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSortedByFavorites, setIsSortedByFavorites] = useState(false);
  const recordPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / recordPerPage);
  // from the last record of the last page + 1 (first record on this page) to the last record on the current page
  const recordsOnCurrentPage = filteredData.slice((currentPage - 1) * recordPerPage, currentPage * recordPerPage)

  // search 
  const handleSearch = (e) => {
    e.preventDefault();
    const filteredSearch = ApplicantData.filter((applicant) => (
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase())
    ))
    setFilteredData(filteredSearch);
  }

  // update status
  const handleStatusChange = (e, id) => {
    const updatedRecord = filteredData.map((applicant) => (
      applicant._id === id ? { ...applicant, status: e.target.value } : applicant
    ))
    setFilteredData(updatedRecord)
  }

  // pagination
  const toNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }

  const toPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }

  // toggle bookmarks
  const toggleApplicantBookmark = (id) => {
    const updatedData = filteredData.map((applicant) =>
      applicant._id === id ? { ...applicant, isSaved: !applicant.isSaved } : applicant
    )
    setFilteredData(updatedData);

    // apply sorting if it's currently sorted by favorites
    if (isSortedByFavorites) {
      const sorted = [...updatedData].sort((a, b) =>
        Number(b.isSaved) - (a.isSaved)
      )
      setFilteredData(sorted)
    }
  }

  // sort applicants by bookmarks
  const handleSortByFavorites = () => {
    if (isSortedByFavorites) {
      // set back to original order
      setFilteredData(originalData);
    } else {
      // sort data with favorite ones on top
      const sorted = [...filteredData].sort((a, b) =>
        Number(b.isSaved) - (a.isSaved)
      )
      setFilteredData(sorted)
    }
    // toggle
    setIsSortedByFavorites(!isSortedByFavorites);
  }
  return (
    <Card className="min-h-screen py-8 px-4 shadow-none rounded-none">
      <div className="w-full max-w-4xl mx-auto">
        <CardHeader floated={false} shadow={false} className="p-0 mb-4">
          <div className="text-center py-4">
            <h2 className="text-2xl font-semibold">View Applicants</h2>
          </div>
          <form
            onSubmit={handleSearch}
            className="flex items-center w-2/3 sm:w-auto sm:justify-end justify-center mx-auto">
            <input
              type="text"
              id="search-bar"
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
            <table className="w-full table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-b border-gray-300 bg-gray-200 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold text-black text-1xl leading-none opacity-70"
                      >
                        {head === "Starred" ? (
                          <span className="flex items-center cursor-pointer" onClick={handleSortByFavorites}>
                            Starred
                            <FaSort className={isSortedByFavorites ? 'text-red-500' : 'text-black'} />
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
                {recordsOnCurrentPage.length > 0 ? recordsOnCurrentPage.map((data) => (
                  <tr key={data._id} className="even:bg-gray-100">
                    <td className="p-4">
                      <button
                        onClick={() => toggleApplicantBookmark(data._id)}
                        className="cursor-pointer">
                        {data.isSaved ? (
                          <FaBookmark className="text-red-400" />
                        ) : (
                          <FaRegBookmark />
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <Link to="/" className="cursor-pointer">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.name}
                        </Typography>
                      </Link>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {data.position}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                      </Typography>
                    </td>
                    <td className="p-4">
                      <select
                        value={data.status}
                        className="p-2 bg-gray-100 rounded-md text-sm"
                        onChange={(e) => handleStatusChange(e, data._id)}
                      >
                        <option value="interview">Interview</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>

                    </td>
                  </tr>
                )) : (
                  <td
                    colSpan={TABLE_HEAD.length}
                    className="text-center p-10">
                    No applicants found
                  </td>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>

        <CardFooter className="border-t border-blue-gray-50 p-0 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between justify-center gap-4">
            <Typography variant="small" color="blue-gray" className="font-normal text-center">
              Page {currentPage} of {totalPages}
            </Typography>
            <div className="flex gap-2 justify-center">
              <Button variant="outlined" size="sm" onClick={toPrevPage}>Previous</Button>
              <Button variant="outlined" size="sm" onClick={toNextPage}>Next</Button>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}

export default Applicants;
