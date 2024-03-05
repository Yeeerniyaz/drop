import React from 'react';

import './loadStyle.css';

export default function Load() {
	return (
		<div className='load'>
			<div>
				<div className="spinner-box">
					<div className="configure-border-1">
						<div className="configure-core"></div>
					</div>
					<div className="configure-border-2">
						<div className="configure-core"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
