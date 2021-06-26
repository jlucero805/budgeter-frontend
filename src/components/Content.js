import React, {useState} from 'react'
import { useUser } from '../providers/UserProvider'
import { service } from '../services/service';
import { isThisWeek, isThisMonth, isToday, isThisHour, parseJSON } from 'date-fns';

const Content = () => {
	const { token, setToken } = useUser();
	const { purchases, setPurchases } = useUser();
	const [adder, setAdder] = useState(false);
	// adder field
	const [type, setType] = useState('Personal-development');
	const [item, setItem] = useState('');
	const [cost, setCost] = useState('');

	const typeChanger = e => { setType(e.target.value); }
	const itemChanger = e => { setItem(e.target.value); }
	const costChanger = e => { setCost(e.target.value); }

	const saveClicker = async () => {
		if (type === '' || item === '' || cost === '') alert('please fill out all fields');
		const newPurchase = await service.addPurchase(token, {item: item, type: type, cost: cost});
		setPurchases(purchase => purchase.concat(newPurchase.data));
		resetFields();
	}

	const purchaseDeleter = async (id) => {
		await service.deletePurchase(token, id);
		setPurchases(purchase => purchase.filter(e => e.id !== id));
	}

	const resetFields = () => {
		setType('');
		setItem('');
		setCost('');
	}

	return (
		<div>
			<div className="nav">navbar</div>
			<h2>total: {purchases.reduce((acc, purchase) => acc + purchase.cost, 0)}</h2>
			<h2>monthly: {purchases.filter(purchase => isThisMonth(parseJSON(purchase.date))).reduce((acc, purchase) => acc + purchase.cost, 0)}</h2>
			<h2>weekly: {purchases.filter(purchase => isThisWeek(parseJSON(purchase.date))).reduce((acc, purchase) => acc + purchase.cost, 0)}</h2>
			<h2>daily: {purchases.filter(purchase => isToday(parseJSON(purchase.date))).reduce((acc, purchase) => acc + purchase.cost, 0)}</h2>
			<h2>hourly: {purchases.filter(purchase => isThisHour(parseJSON(purchase.date))).reduce((acc, purchase) => acc + purchase.cost, 0)}</h2>
			<button className="add-btn" onClick={() => setAdder(cond => !cond)}>add</button>
			{adder ? <div className="add-menu">
				<div className="input-field"><p>item: </p> <input onChange={e => itemChanger(e)} value={item}></input></div>
				<div className="input-field"><p>cost: </p> <input type="number" onChange={e => costChanger(e)} value={cost}></input></div>
				<div className="input-field"><p>type: </p>
				<select onChange={e => typeChanger(e)} value={type}>
					<option>Personal-development</option>
					<option>Materialistic Desires</option>
					<option>Entertainment</option>
					<option>Food</option>
				</select>
				</div>
				<div><button onClick={saveClicker}>save</button></div>
			</div> : null}
			{purchases.map(purchase => (
				<div key={purchase.id}>
					{`$${purchase.cost} - ${purchase.item}`} <button onClick={() => purchaseDeleter(purchase.id)}>delete</button>
				</div>
			))}
		</div>
	)
}

export default Content