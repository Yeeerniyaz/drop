import { Link } from 'react-router-dom';
import './homeStyle.css';

export default function HomePage() {
	return (
		<div className="home">
			<div className="container">
				<div className="home__container">
					<h1 className="home__title">
						My <span>First Project:</span> Web Application with Node.js and React
					</h1>
					<p className="home__description">
						Hello! I'm excited to share information about my first project, a web application developed using Node.js
						and React. This project also functions as a <span>file storage solution named Dropit.</span> Explore its
						features and manage your files effortlessly.
					</p>
					<div className="home__btn__group">
						<Link to={'/auth'}>
							<button className="home__btn__start">Open Application</button>
						</Link>
						<Link to={'mailto:t.yerniyaz@gmail.com'}>
							<button className="home__btn__email">Contact via Email</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
