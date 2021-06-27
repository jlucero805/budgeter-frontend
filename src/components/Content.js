import React, { useState } from 'react'
import { useUser } from '../providers/UserProvider'
import { service } from '../services/service';
import { isThisWeek, isThisMonth, isToday, isThisHour, parseJSON } from 'date-fns';
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
	const [adder, setAdder] = useState(true);
	// adder field
	const [type, setType] = useState('Materialistic Desires');
	const [item, setItem] = useState('');
	const [cost, setCost] = useState('');
	// show data
	const [showData, setShowData] = useState(false);

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
		}
	}

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

	return (
		<div className="content">
			<h2>{strings.TOTAL}: {funcs.toUsd(purchases.reduce((acc, purchase) => acc + purchase.cost, 0))}</h2>
			<Navbar />

			<button className="add-btn" onClick={purchasePageClicker}>{strings.ADD}</button>
			<button onClick={dataPageClicker}>{strings.SHOW_DATA}</button>

			{/* purchases */}
			<div className={page === 'purchases' ? '' : "hide"}>

				<div className="adder-box">
					{adder ? <div className="add-menu">
						<div className="input-field"><p>{strings.ITEM}: </p> <input onChange={e => itemChanger(e)} value={item}></input></div>
						<div className="input-field"><p>{strings.COST}: </p> <input type="number" onChange={e => costChanger(e)} value={cost}></input></div>
						<div className="input-field"><p>{strings.TYPE}: </p>
							<select onChange={e => typeChanger(e)} value={type}>
								{types.map(def => (
									<option key={def}>{def}</option>
								))}
							</select>
						</div>
						<div><button onClick={saveClicker}>{strings.SAVE}</button></div>
					</div> : null}
				</div>

				<div className="purchases">
					{purchases.map(purchase => (
						<div key={purchase.id}>
							{`${funcs.toUsd(purchase.cost)} - ${purchase.item}`} <button onClick={() => purchaseDeleter(purchase.id)}>{strings.DELETE}</button>
						</div>))}
				</div>
			</div>


			<div className={page === 'data' ? '' : 'hide'}>
				<h4 className="nopad">{strings.MONTHLY}: {purchases.filter(purchase => isThisMonth(parseJSON(purchase.date))).reduce((acc, purchase) => acc + purchase.cost, 0).toFixed(2)}</h4>
				<h4 className="nopad">{strings.WEEKLY}: {purchases.filter(purchase => isThisWeek(parseJSON(purchase.date))).reduce((acc, purchase) => acc + purchase.cost, 0).toFixed(2)}</h4>
				<h4 className="nopad">{strings.DAILY}: {purchases.filter(purchase => isToday(parseJSON(purchase.date))).reduce((acc, purchase) => acc + purchase.cost, 0).toFixed(2)}</h4>
				<h4 className="nopad">{strings.HOURLY}: {purchases.filter(purchase => isThisHour(parseJSON(purchase.date))).reduce((acc, purchase) => acc + purchase.cost, 0).toFixed(2)}</h4>
				<p></p>
				{types.length > 0 ? types.map(def => (
					<h4 key={def} className="nopad">
						{def} : {purchases.filter(purchase => purchase.type === def).reduce((acc, purchase) => acc + purchase.cost, 0).toFixed(2)}
					</h4>
				)) : null}
			</div>
			<button onClick={logoutClicker}>{strings.LOGOUT}</button>
		</div >
	)
}

export default Content