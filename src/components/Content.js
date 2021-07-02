import React, { useState } from 'react'
import { useUser } from '../providers/UserProvider'
import { service } from '../services/service';
import { formatRFC7231, isThisWeek, isThisMonth, isToday, isThisHour, parseJSON } from 'date-fns';
import { strings } from '../res/strings';
import { funcs } from '../utils/funcs';
import Navbar from './Navbar';

const Content = () => {
	const { token, setToken } = useUser();
	const { purchases, setPurchases } = useUser();
	const { types, setTypes } = useUser();
	const { loggedIn, setLoggedIn } = useUser();
	const { page, setPage } = useUser();

	// if adder field shows or not
	const [adder, setAdder] = useState(false);
	// adder field
	const [type, setType] = useState('Materialistic Desires');
	const [item, setItem] = useState('');
	const [cost, setCost] = useState('');
	// show delete btn
	const [edit, setEdit] = useState(false);

	// detail item
	const [detail, setDetail] = useState({});
	const [detailPage, setDetailPage] = useState(false);

	const typeChanger = e => { setType(e.target.value); }
	const itemChanger = e => { setItem(e.target.value); }
	const costChanger = e => { setCost(e.target.value); }

	const logoutClicker = () => {
		setToken('');
		localStorage.setItem('token', '');
		setPurchases([]);
		setTypes([]);
		resetFields();
		setLoggedIn(false);
	}

	const saveClicker = async () => {
		if (type === '' || item === '' || cost === '') alert('please fill out all fields');
		else {
			const newPurchase = await service.addPurchase(token, { item: item, type: type, cost: cost });
			setPurchases(purchase => [newPurchase.data].concat(purchase));
			resetFields();
			cancelClicker();
		}
	}

	const cancelClicker = () => { setAdder(prev => false); }

	const dataPageClicker = async () => {
		// shows data and closes adder
		// setAdder(state => false);
		// setShowData(state => true);
		setPage('data');
	}

	const purchasePageClicker = () => {
		// shows adder and closes data
		// setAdder(state => true);
		// setShowData(state => false);
		setPage('purchases');
	}

	const purchaseDeleter = async (id) => {
		if (window.confirm('Once you delete an item, it cannot be reversed')) {
			await service.deletePurchase(token, id);
			setPurchases(purchase => purchase.filter(e => e.id !== id));
		}
	}

	const resetFields = () => {
		setItem('');
		setCost('');
	}

	const editClicker = () => { setEdit(prev => !prev); }

	const addClicker = () => { setAdder(prev => true); }

	const openClicker = object => {
		setDetail(object);
		setDetailPage(prev => true);
	}

	const closeClicker = () => {
		setDetail({});
		setDetailPage(prev => false);
	}

	return (
		<div className="content">
			<h2 className="text">{strings.TOTAL}: {funcs.toUsd(purchases.reduce((acc, purchase) => acc + purchase.cost, 0))}</h2>
			<Navbar />

			<div className="menu box">
				<button className="add-btn btn text" onClick={purchasePageClicker}>{strings.ADD}</button>
				<button className="btn text" onClick={dataPageClicker}>{strings.SHOW_DATA}</button>
			</div>

			{/* purchases */}
			<div className={page === 'purchases' ? 'purchases' : "hide"}>

				{/* <div className={adder ? "adder-box box" : "hide"} > */}
				<div className={adder ? "popup" : "hide"} >
					{adder ? <div className="popup-window box">
						<div className="input-field text"><p>{strings.ITEM}: </p> <input className="input text" onChange={e => itemChanger(e)} value={item}></input></div>
						<div className="input-field text"><p>{strings.COST}: </p> <input className="input text" type="number" onChange={e => costChanger(e)} value={cost}></input></div>
						<div className="input-field text"><p>{strings.TYPE}: </p>
							<select onChange={e => typeChanger(e)} value={type}>
								{types.map(def => (
									<option className="" key={def}>{def}</option>
								))}
							</select>
						</div>
						<div>
							<button className="btn text" onClick={saveClicker}>{strings.SAVE}</button>
							<button className="btn text" onClick={cancelClicker}>{strings.CANCEL}</button>
						</div>
					</div> : null}
				</div>

				<div className="purchases box">
					<div className="menu box">
						<button onClick={addClicker} className="btn">{strings.ADDER}</button>
						<button onClick={editClicker} className="btn">{strings.EDIT}</button>
					</div>
					{purchases.map(purchase => (
						<div className="split" key={purchase.id}>
							<p className="purchase-item">{`${funcs.toUsd(purchase.cost)} - ${purchase.item}`}</p>
							<div>
								<button className={edit ? 'btn' : 'hide'} onClick={() => openClicker(purchase)}>{strings.OPEN}</button>
								<button className={edit ? "btn" : "hide"} onClick={() => purchaseDeleter(purchase.id)}>{strings.DELETE}</button>
							</div>
						</div>))}
				</div>

			</div>


			<div className={page === 'data' ? 'purchases' : 'hide'}>
				<div className="box">
					<h4 className="nopad text">{strings.MONTHLY}: {purchases.filter(purchase => isThisMonth(parseJSON(purchase.date))).reduce((acc, purchase) => acc + purchase.cost, 0).toFixed(2)}</h4>
					<h4 className="nopad text">{strings.WEEKLY}: {purchases.filter(purchase => isThisWeek(parseJSON(purchase.date))).reduce((acc, purchase) => acc + purchase.cost, 0).toFixed(2)}</h4>
					<h4 className="nopad text">{strings.DAILY}: {purchases.filter(purchase => isToday(parseJSON(purchase.date))).reduce((acc, purchase) => acc + purchase.cost, 0).toFixed(2)}</h4>
					<h4 className="nopad text">{strings.HOURLY}: {purchases.filter(purchase => isThisHour(parseJSON(purchase.date))).reduce((acc, purchase) => acc + purchase.cost, 0).toFixed(2)}</h4>
				</div>
				<p></p>
				<div className="box">
					{types.length > 0 ? types.map(def => (
						<h4 key={def} className="nopad text">
							{def} : {purchases.filter(purchase => purchase.type === def).reduce((acc, purchase) => acc + purchase.cost, 0).toFixed(2)}
						</h4>
					)) : null}
				</div>
			</div>
			<button className="btn text" onClick={logoutClicker}>{strings.LOGOUT}</button>

			{detailPage
				? <div className="popup">
					<div className="popup-window box">
						<p>{detail.item}</p>
						<p>{detail.type}</p>
						<p>{funcs.toUsd(detail.cost)}</p>
						<p>{formatRFC7231(parseJSON(detail.date))}</p>
						<button className="btn" onClick={closeClicker}>{strings.CLOSE}</button>
					</div>
				</div>
				: null }

		</div >
	)
}

export default Content