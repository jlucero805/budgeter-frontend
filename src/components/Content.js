import React from 'react'
import { useUser } from '../providers/UserProvider'
import { service } from '../services/service';

const Content = () => {
	const { token, setToken } = useUser();
	const { purchases, setPurchases } = useUser();

	return (
		<div>
			{purchases.map(purchase => (
				<div key={purchase.id}>
					{purchase.item} {purchase.type} {purchase.cost}
				</div>
			))}
		</div>
	)
}

export default Content