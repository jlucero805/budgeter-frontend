import React, { useState } from 'react'
import { useUser } from '../providers/UserProvider'
import { service } from '../services/service';
import { isThisWeek, isThisMonth, isToday, isThisHour, parseJSON } from 'date-fns';

const Content = () => {
	const { token, setToken } = useUser();
	const { purchases, setPurchases } = useUser();
	const { types, setTypes } = useUser();

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

	// HARD CODING
	const defaults = [
		'Materialistic Desires',
		'Food',
		'Personal Development',
		'Entertainment',
		'Professional'
	]

	const saveClicker = async () => {
		if (type === '' || item === '' || cost === '') alert('please fill out all fields');
		else {
			const newPurchase = await service.addPurchase(token, { item: item, type: type, cost: cost });
			setPurchases(purchase => [newPurchase.data].concat(purchase));
			resetFields();
		}
	}

	const dataClicker = async () => {
		setAdder(state => false);
		setShowData(state => true);
	}

	const addClicker = () => {
		setAdder(state => true);
		setShowData(state => false);
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
		<div>
			<div className="nav">navbar</div>
			<h2>total: {purchases.reduce((acc, purchase) => acc + purchase.cost, 0)}</h2>
			<button className="add-btn" onClick={addClicker}>add</button>
			<button onClick={dataClicker}>show data</button>
			<div className={showData ? '' : 'hide'}>
				<h4 className="nopad">monthly: {purchases.filter(purchase => isThisMonth(parseJSON(purchase.date))).reduce((acc, purchase) => acc + purchase.cost, 0)}</h4>
				<h4 className="nopad">weekly: {purchases.filter(purchase => isThisWeek(parseJSON(purchase.date))).reduce((acc, purchase) => acc + purchase.cost, 0)}</h4>
				<h4 className="nopad">daily: {purchases.filter(purchase => isToday(parseJSON(purchase.date))).reduce((acc, purchase) => acc + purchase.cost, 0)}</h4>
				<h4 className="nopad">hourly: {purchases.filter(purchase => isThisHour(parseJSON(purchase.date))).reduce((acc, purchase) => acc + purchase.cost, 0)}</h4>
				<p></p>
				{types.length > 0 ? types.map(def => (
					<h4 key={def} className="nopad">
						{def} : {purchases.filter(purchase => purchase.type === def).reduce((acc, purchase) => acc + purchase.cost, 0)}
					</h4>
				)) : null}
			</div>
			{
				adder ? <div className="add-menu">
					<div className="input-field"><p>item: </p> <input onChange={e => itemChanger(e)} value={item}></input></div>
					<div className="input-field"><p>cost: </p> <input type="number" onChange={e => costChanger(e)} value={cost}></input></div>
					<div className="input-field"><p>type: </p>
						<select onChange={e => typeChanger(e)} value={type}>
							{types.map(def => (
								<option key={def}>{def}</option>
							))}
						</select>
					</div>
					<div><button onClick={saveClicker}>save</button></div>
				</div> : null
			}
			{
				purchases.map(purchase => (
					<div key={purchase.id}>
						{`$${purchase.cost} - ${purchase.item}`} <button onClick={() => purchaseDeleter(purchase.id)}>delete</button>
					</div>
				))
			}
		</div >
	)
}

export default Content