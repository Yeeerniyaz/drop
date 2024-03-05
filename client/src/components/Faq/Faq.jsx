import React from 'react';
import { Text, Box, Stack, rem } from '@mantine/core';
import { IconSun, IconPhone, IconMapPin, IconAt } from '@tabler/icons-react';
import './ContactIcons.css';

function ContactIcon({ icon: Icon, title, description }) {
	return (
		<div className="wrapper">
			<Box mr="md">
				<Icon style={{ width: rem(24), height: rem(24) }} />
			</Box>

			<div className="ifsjkcac">
				<Text size="xs" className="title">
					{title}
				</Text>
				<Text className="description">{description}</Text>
			</div>
		</div>
	);
}

const MOCKDATA = [
	{ title: 'Email', description: 't.yerniyaz@gmail.com', icon: IconAt },
	{ title: 'Phone', description: '+7 (706) 606 63 23', icon: IconPhone },
	{ title: 'Address', description: 'Almaty, Kazakhstan, Almaty', icon: IconMapPin },
	{ title: 'Working hours', description: '8 a.m. – 11 p.m.', icon: IconSun },
];

export function Faq() {
	const items = MOCKDATA.map((item, index) => <ContactIcon key={index} {...item} />);
	return <Stack>{items}</Stack>;
}
