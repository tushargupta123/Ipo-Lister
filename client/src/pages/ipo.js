import { useEffect, useState } from 'react'
import { createIpoApi, deleteIpoApi, getAllIpoApi, updateIpoApi } from '../api/ipoApi';
import StripeCheckout from "react-stripe-checkout";
import { createAllocationApi, listOfIposOfUserApi } from '../api/allocationApi';
const STRIPE_KEY = "pk_test_51NS13iSCXLoy346Z0F82nga3PmKQLdQeXOo75blXuf3c8RE74S37Gr51hE8qgo3rfojg6k2QAWFOS9D4nXOQnBml00yBHBP6aL";

const Ipo = () => {
  const [shares, setShares] = useState(10);
  const [company, setCompany] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState();
  const [admin, setAdmin] = useState(false);
  const [mode, setMode] = useState('none');
  const [log, setLog] = useState("");
  const [upcomingIpo, setUpcomingIpo] = useState();
  const [openIpo, setOpenIpo] = useState();
  const [listedIpo, setListedIpo] = useState();
  const [ipoId, setIpoId] = useState();
  const [myIpos, setMyIpos] = useState();

  const changeShares = (update) => {
    if (update == "+") {
      setShares(shares + 10);
    } else {
      if (shares > 10) {
        setShares(shares - 10);
      }
    }
  }

  const createIpo = async () => {
    const response = await createIpoApi({ name: company, shares, price, description, startDate });
    if (response) {
      setLog("Ipo created Successfully !")
      setCreateCard();
    } else {
      setLog("Try Again !")
    }
  }

  const updateIpo = async () => {
    const response = await updateIpoApi({ id: ipoId, name: company, shares, price: Number(price), description, startDate });
    if (response) {
      setLog("Ipo updated Successfully !")
      getAllIpos();
    } else {
      setLog("Try Again !")
    }
  }

  const deleteIpo = async (id) => {
    await deleteIpoApi({ id });
    getAllIpos();
  }

  const setUpdateCard = (ipo) => {
    setMode('update');
    setCompany(ipo.name);
    setPrice(ipo.price);
    setDescription(ipo.description);
    setShares(ipo.shares);
    setStartDate((ipo.startDate).substring(0, 10));
    setIpoId(ipo._id)
  }

  const setCreateCard = () => {
    setMode('create');
    setCompany("");
    setPrice(0);
    setDescription("");
    setShares(10);
    setStartDate(Date.now());
  }

  const setApplyCard = (ipo) => {
    setMode('apply');
    setCompany(ipo.name);
    setPrice(ipo.price);
    setDescription(ipo.description);
    setShares(10);
    setStartDate((ipo.startDate).substring(0, 10));
    setIpoId(ipo._id)
  }

  const getAllIpos = async () => {
    const upcoming = await getAllIpoApi({ type: "upcoming" });
    setUpcomingIpo(upcoming);
    const listed = await getAllIpoApi({ type: "listed" });
    setListedIpo(listed);
    const open = await getAllIpoApi({ type: "open" });
    setOpenIpo(open);
  }

  const onToken = async (token) => {
    const response = await createAllocationApi({ ipoId, shares, token });
    if (response.transactionId) {
      setLog(`Congratulations! Ipo Applied successfully. \nTransaction Id: ${response.transactionId}`)
      setMode('none');
    } else {
      setLog(`Payment Failed! Try Again.`)
    }
  }

  const listMyIpos = async () => {
    setMode("myipo");
    const list = await listOfIposOfUserApi();
    setMyIpos(list);
  }

  useEffect(() => {
    if (localStorage.getItem('isAdmin') == 'true') {
      setAdmin(true);
      setMode('create');
    }
    setTimeout(() => {
      setLog("");
    }, 3000);
    getAllIpos();
  }, [log]);

  return (
    <div className="container text-light">
      <div className="row pt-5">
        <div className="col-7">
          <div className="row">
            <div className="col-8">
              <h2>IPO - Initial Public Offerings</h2>
            </div>
            <div className="col-4 text-end">
              {mode == 'update' && (
                <button
                  className="btn btn-outline-secondary me-2"
                  type="button"
                  id="button-addon1"
                  onClick={() => setCreateCard()}
                >
                  Create
                </button>
              )}
              {!admin && mode != "myipo" && (
                <button
                  className="btn btn-outline-secondary me-2"
                  type="button"
                  id="button-addon1"
                  onClick={() => listMyIpos()}
                >
                  My Ipo's
                </button>
              )}
            </div>
          </div>
          <div className="row mt-5">
            <h4>Open</h4>
            <div className="card mt-4 text-bg-dark border-2 border-black">
              <div className="card-header">
                <div className="row">
                  <div className="col-3">
                    <div className="text-info">Companies</div>
                  </div>
                  <div className="col-3">
                    <div className="text-info">Closes on</div>
                  </div>
                  <div className="col-3">
                    <div className="text-info">Price</div>
                  </div>
                  <div className="col-3"></div>
                </div>
              </div>
              <ul className="list-group list-group-flush ">
                {openIpo && openIpo.length > 0 ? (
                  <>
                    {
                      openIpo.map(ipo => (
                        <li key={ipo._id} className="list-group-item text-bg-dark border-black">
                          <div className="row">
                            <div className="col-3 pt-2">
                              <div>{ipo.name}</div>
                            </div>
                            <div className="col-3 pt-2">
                              <div>{(ipo.startDate).substring(0, 10).split('-').reverse().join('-')}</div>
                            </div>
                            <div className="col-3 pt-2">
                              <div>&#x20b9; {ipo.price}</div>
                            </div>
                            <div className="col-3">
                              {!admin && (
                                <div>
                                  <button
                                    className="btn btn-outline-secondary me-2"
                                    type="button"
                                    id="button-addon1"
                                    onClick={() => setApplyCard(ipo)}
                                  >
                                    Apply
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      ))
                    }
                  </>
                ) : (
                  <p className='ps-3 pt-2'>There are no Open IPOs.</p>
                )}
              </ul>
            </div>
          </div>
          <div className="row mt-5">
            <h4>Upcoming</h4>
            <div className="card mt-4 text-bg-dark border-2 border-black">
              <div className="card-header">
                <div className="row">
                  <div className="col-3">
                    <div className="text-info">Companies</div>
                  </div>
                  <div className="col-3">
                    <div className="text-info">Starts on</div>
                  </div>
                  <div className="col-3">
                    <div className="text-info">Price</div>
                  </div>
                  <div className="col-3"></div>
                </div>
              </div>
              <ul className="list-group list-group-flush ">
                {upcomingIpo && upcomingIpo.length > 0 ? (
                  <>
                    {
                      upcomingIpo.map(ipo => (
                        <li key={ipo._id} className="list-group-item text-bg-dark border-black">
                          <div className="row">
                            <div className="col-3 pt-2">
                              <div>{ipo.name}</div>
                            </div>
                            <div className="col-3 pt-2">
                              <div>{(ipo.startDate).substring(0, 10).split('-').reverse().join('-')}</div>
                            </div>
                            <div className="col-3 pt-2">
                              <div>&#x20b9; {ipo.price}</div>
                            </div>
                            <div className="col-3">
                              {admin && (
                                <div>
                                  <button
                                    className="btn btn-outline-secondary me-2"
                                    type="button"
                                    id="button-addon1"
                                    onClick={() => setUpdateCard(ipo)}
                                  >
                                    Update
                                  </button>
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    id="button-addon1"
                                    onClick={() => deleteIpo(ipo._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      ))
                    }
                  </>
                ) : (
                  <p className='ps-3 pt-2'>There are no Upcoming IPOs.</p>
                )}
              </ul>
            </div>
          </div>
          <div className="row mt-5">
            <h4>Listed</h4>
            <div className="card mt-4 text-bg-dark border-2 border-black">
              <div className="card-header">
                <div className="row">
                  <div className="col-3">
                    <div className="text-info">Companies</div>
                  </div>
                  <div className="col-3">
                    <div className="text-info">Closed on</div>
                  </div>
                  <div className="col-3">
                    <div className="text-info">Listing Price</div>
                  </div>
                  <div className="col-3"></div>
                </div>
              </div>
              <ul className="list-group list-group-flush ">
                {listedIpo && listedIpo.length > 0 ? (
                  <>
                    {
                      listedIpo.map(ipo => {
                        let originalDate = new Date(ipo.startDate);
                        originalDate.setDate(originalDate.getDate() + 5);
                        let day = String(originalDate.getDate()).padStart(2, '0');
                        let month = String(originalDate.getMonth() + 1).padStart(2, '0');
                        let year = originalDate.getFullYear();
                        let formattedDate = `${day}-${month}-${year}`;
                        return (
                          <li key={ipo._id} className="list-group-item text-bg-dark border-black">
                            <div className="row">
                              <div className="col-3 pt-2">
                                <div>{ipo.name}</div>
                              </div>
                              <div className="col-3 pt-2">
                                <div>{formattedDate}</div>
                              </div>
                              <div className="col-3 pt-2">
                                <div>&#x20b9; {ipo.price}</div>
                              </div>
                            </div>
                          </li>
                        );
                      })
                    }
                  </>
                ) : (
                  <p className='ps-3 pt-2'>There are no Listed IPOs.</p>
                )}

              </ul>
            </div>
          </div>
        </div>
        <div className="col-1"></div>
        <div className="col-4">
          <div className="card text-bg-dark mb-3 border-3">
            {admin && (
              <>
                <div className="card-header pt-4 pb-2">Admin</div>
                <div className="card-body row mb-5 pb-5 pt-4 mt-3">
                  <div className="col-5">
                    <p style={{ fontSize: "17px" }}>Comapany</p>
                    <p style={{ fontSize: "17px" }}>Shares <span style={{ fontSize: "12px" }}>Lot of 10</span></p>
                    <p style={{ fontSize: "17px", paddingTop: "5px" }}>Price</p>
                    <p style={{ fontSize: "17px", paddingTop: "5px" }}>Description</p>
                    <p style={{ fontSize: "17px", paddingTop: "3px" }}>Start Date</p>
                  </div>
                  <div className="col-7">
                    <div className="input-group">
                      <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="form-control input_shares ps-3" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                    </div>
                    <div className="input-group mt-3">
                      <input type="Number" value={shares} onChange={(e) => setShares(e.target.value)} className="form-control input_shares ps-3" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                    </div>
                    <div className="input-group mt-3">
                      <input type="Number" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control input_shares ps-3" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                    </div>
                    <div className="input-group mt-3">
                      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control input_shares ps-3" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                    </div>
                    <div className="input-group mt-3">
                      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-control input_shares ps-3" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                    </div>
                  </div>
                </div>
                <div className="card-footer row ps-4 pe-4 mt-5">
                  <p className="text-danger">{log}</p>
                  {mode === "create" && (
                    <button type="button" className="btn btn-secondary mt-3 mb-2" onClick={() => createIpo()}>Create IPO</button>
                  )}
                  {mode === "update" && (
                    <button type="button" className="btn btn-secondary mt-3 mb-2" onClick={() => updateIpo()}>Update IPO</button>
                  )}
                </div>
              </>
            )}
            {mode == 'none' && (
              <>
                <div className="card-body row mb-5 pb-5 pt-4 mt-3">
                  <img src='https://cdn1.iconfinder.com/data/icons/stock-market-1-7/1024/ipo-512.png' height='200' width='50' />
                  <p className='text-center pt-5 pb-3 text-info'>{log}</p>
                  <p className='text-center pt-5'>Apply for an open Ipo.</p>
                </div>
              </>
            )}
            {mode == 'apply' && (
              <>
                <div className="card-header pt-4 pb-2">{company}</div>
                <div className="card-body row mb-5 pb-5 pt-4 mt-3">
                  <div className="col-5">
                    <p style={{ fontSize: "17px" }}>Shares <span style={{ fontSize: "12px" }}>Lot of 10</span></p>
                    <p className='pt-1' style={{ fontSize: "17px" }}>Price</p>
                  </div>
                  <div className="col-7">
                    <div className="input-group">
                      <button className="btn btn-outline-secondary add_button" type="button" id="button-addon1" onClick={() => changeShares("-")}>-</button>
                      <input type="text" value={shares} disabled className="form-control input_shares text-center" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                      <button className="btn btn-outline-secondary add_button" type="button" id="button-addon1" onClick={() => changeShares("+")}>+</button>
                    </div>
                    <div className="input-group mt-3">
                      <input type="text" value={price} disabled className="form-control input_shares text-center" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                    </div>
                  </div>
                </div>
                <div className="card-footer row ps-4 pe-4 mt-5">
                  <div className="col-6">
                    Amount to be blocked :
                  </div>
                  <div className="col-6 text-end mb-3">
                    &#x20b9; {price * shares}
                  </div>
                  <StripeCheckout
                    billingAddress
                    currency='inr'
                    token={onToken}
                    stripeKey={STRIPE_KEY}
                    amount={price * shares * 100}
                  />
                </div>
              </>
            )}
          </div>
          {mode == "myipo" && (
            <div className="row mt-5">
              <h3>My Ipo's</h3>
              <div className="card mt-4 text-bg-dark border-2 border-black">
                <div className="card-header">
                  <div className="row">
                    <div className="col-4">
                      <div className="text-info">Companies</div>
                    </div>
                    <div className="col-4">
                      <div className="text-info">Shares</div>
                    </div>
                    <div className="col-4">
                      <div className="text-info">Status</div>
                    </div>
                  </div>
                </div>
                <ul className="list-group list-group-flush ">
                  {myIpos && myIpos.length > 0 ? (
                    <>
                      {
                        myIpos.map(obj => (
                          <li key={obj._id} className="list-group-item text-bg-dark border-black">
                            <div className="row">
                              <div className="col-4 pt-2">
                                <div>{obj.ipo.name}</div>
                              </div>
                              <div className="col-4 pt-2">
                                <div>{obj.shares}</div>
                              </div>
                              <div className="col-4">
                                <div>
                                  <button
                                    className="btn btn-outline-secondary me-2"
                                    type="button"
                                    id="button-addon1"
                                    disabled
                                  >
                                    {new Date(obj.ipo.startDate) < new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() - 5)) ? "Allocated" : "Applied"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))
                      }
                    </>
                  ) : (
                    <p className='ps-3 pt-2'>You haven't applied for any IPOs.</p>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Ipo;
