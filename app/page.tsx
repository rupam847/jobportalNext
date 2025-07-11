"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { myAppHook } from "@/context/AppProvider";
import homeStyle from "./home.module.css";
import { formatDistanceToNow } from "date-fns";


interface filterData {
  title: string,
  location: string,
  categories: any,
  salary: any,
  sort: any,
  page: any
}
export default function Home() {
  const [filterData, setFilterData] = useState<filterData>({
    title: "",
    location: "",
    categories: [],
    salary: "",
    sort: "",
    page: 1
  });

  const [jobcategories, setJobCategories] = useState<any>([]);
  const [jobsalary, setJobSalary] = useState<any>([
    '0 - 2000', '2000 - 6000', '6000 - 10000', '10000 - 15000', '1500+'
  ]);
  const [jobData, setJobData] = useState<any>([]);

  const filterInputHandler = (e: any) => {
    setFilterData({ ...filterData, page: 1 });
    setFilterData({ ...filterData, [e.target.id]: e.target.value });
    console.log(filterData);
  }

  const filterSelectHandler = (e: any) => {
    setFilterData({ ...filterData, page: 1 });
    setFilterData({ ...filterData, [e.target.id]: e.target.value });
  }

  const filterCheckedHandler = (e: any) => {
    const { value, checked } = e.target;
    setFilterData({ ...filterData, page: 1 });

    const updatedFilterData = setFilterData((prevFilterData) => {
      let updatedCategories = [...prevFilterData.categories];
      if (checked) {
        updatedCategories.push(value);
      } else {
        updatedCategories = updatedCategories.filter((category) => category !== value);
      }

      return {
        ...prevFilterData,
        categories: updatedCategories,
      };
    });
  }

  const formSubmitHandler = (e: any) => {
    e.preventDefault();
    setFilterData({ ...filterData, page: 1 });
    getJobs();
  }

  const linkPageHandler = (e: any, link: string, active: boolean) => {
    e.preventDefault();
    if (active) return;
    link = link.split('?page=')[1];
    setFilterData({ ...filterData, page: link });
    window.scrollTo(0, 400);
  }

  const resetFilters = () => {
    setFilterData({
      title: "",
      location: "",
      categories: [],
      salary: "",
      sort: "",
      page: 1
    });
  }

  const { categories, allJobs } = myAppHook();

  const getJobs = async () => {
    const job_data: any = await allJobs(filterData);
    setJobData(job_data);
    if (job_data.job_count == undefined) {
      job_data.job_count = 0;
    }
    console.log(job_data.job_count);
  }

  useEffect(() => {
    const getCategories = async () => {
      const category_data: any = await categories();
      if (category_data.success) {
        setJobCategories(category_data.data);
      }
    }
    if (filterData.categories.length === 0) {
      getCategories();
    }
    getJobs();
  }, [filterData.categories, filterData.salary, filterData.sort, filterData.page]);

  return <>
    <section className={`${homeStyle["hero-section"]}`}>
      <div className="container text-center">
        <h1 className="display-4 fw-bold mb-3">Find Your Dream Job Today</h1>
        <p className="lead mb-4">Browse thousands of job listings and find the perfect match for your skills and experience</p>
      </div>
    </section>

    <div className="container">
      <div className={homeStyle["search-card"]}>
        <form onSubmit={(e) => { formSubmitHandler(e) }}>
          <div className="row g-3">
            <div className="col-md-5">
              <div className="form-floating">
                <input type="text" className="form-control" id="title" value={filterData.title} placeholder="Job title, keywords"
                  onChange={filterInputHandler} />
                <label>Job title, keywords</label>
              </div>
            </div>
            <div className="col-md-5">
              <div className="form-floating">
                <input type="text" className="form-control" id="location" value={filterData.location} placeholder="Location"
                  onChange={filterInputHandler} />
                <label>Location</label>
              </div>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100 h-100">Search Jobs</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-3">
          <div className={homeStyle["filter-section"]}>
            <h5 className={homeStyle["filter-title"]}>Filters</h5>

            <div className="mb-4">
              <h6 className="fw-bold mb-3">Job Type</h6>
              {
                jobcategories.length > 0 &&
                jobcategories.map((item: any, index: number) => {
                  return <div key={index} className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" id={`cat${index}`} value={item.category_id}
                      onChange={filterCheckedHandler} checked={filterData.categories.includes(item.category_id)} />
                    <label className="form-check-label" htmlFor={`cat${index}`}>{item.category_name}</label>
                  </div>
                })
              }
            </div>

            <div className="mb-4">
              <h6 className="fw-bold mb-3">Salary Range</h6>
              <select className="form-select" id="salary" name="salary" defaultValue={filterData.salary} onChange={filterSelectHandler}>
                <option value=''>Any</option>
                {
                  jobsalary.map((item: any, index: number) => {
                    return <option key={index} value={item}>{item}</option>
                  })
                }
              </select>
            </div>

            <button className="btn btn-outline-primary w-100" onClick={resetFilters}>Reset Filters</button>
          </div>
        </div>

        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold">{jobData?.job_count} Jobs Found</h4>
            <div>
              <span className="me-2">Sort by:</span>
              <select className="form-select form-select-sm d-inline-block w-auto" id="sort" onChange={filterSelectHandler}>
                <option value="most-relevant">Most Relevant</option>
                <option value="newest">Newest</option>
                <option value="highest-salary">Highest Salary</option>
              </select>
            </div>
          </div>
          {
            jobData.job_count === 0 &&
            <div className="alert alert-info">No jobs found</div>
          }

          {
            jobData.job_count > 0 &&
            jobData.data.data.map((item: any, index: number) => {
              return <div key={index} className={homeStyle["job-card"]}>
                <div className={homeStyle["card-body"]}>
                  <div className="d-flex align-items-start mb-3">
                    <Image src="https://dummyimage.com/60x60?text=Company+Logo" alt="Company Logo" className="rounded-circle me-3" width={60} height={60} />
                    <div>
                      <h5 className={homeStyle["job-title"]}>
                        <Link href={`/jobapply/${item.job_id}`}>{item.job_title}</Link>
                      </h5>
                      <p className={homeStyle["company-name"]}>{item.user.name}</p>
                      <div className="d-flex flex-wrap">
                        <span className={homeStyle["job-location"]}><i className="fas fa-map-marker-alt me-1"></i> {item.job_location}</span>
                        <span className={homeStyle["job-salary"]}><i className="fas fa-dollar-sign me-1"></i>{item.job_salary}</span>
                        <span className={homeStyle["job-type"]}>{item.category.category_name}</span>
                      </div>
                    </div>
                  </div>
                  <p className={homeStyle["job-description"]}>{item.job_description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    {/* <span className="text-muted">Posted 2 days ago</span> */}
                    <span className="text-muted">Posted {
                      (item.created_at) ? 
                      formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : ""
                      }</span>
                    <div>
                      <Link className="btn btn-apply" href={`/jobapply/${item.job_id}`}>Apply Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            })
          }

          {
            jobData.job_count > 0 &&
            <nav aria-label="Job listings pagination" className="mt-4">
              <ul className="pagination justify-content-center">
                {
                  jobData.data.links.map((item: any, index: number) => {
                    // return <li key={index} className={item.active ? "page-item active" : "page-item"}>
                    return <li key={index} className={(item.active ? "page-item active" : "page-item") + (item.url == null ? " disabled" : "")}>
                      <button className="page-link" dangerouslySetInnerHTML={{ __html: `${item.label}` }}
                        onClick={(e) => linkPageHandler(e, item.url, item.active)}></button>
                    </li>
                  })
                }
              </ul>
            </nav>
          }

        </div>
      </div>
    </div>
  </>
}
