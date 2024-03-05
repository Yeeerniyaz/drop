import { Image, Container, Title, Text, SimpleGrid } from '@mantine/core';
import './NotFoundImage.css';

export function ErrPage() {
	return (
		<Container className="rootErr">
			<SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
				<div>
					<Title className="titleErr">Page not found</Title>
					<Text c="dimmed" size="lg">
						Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to
						another URL. If you think this is an error contact support.
					</Text>
				</div>
			</SimpleGrid>
		</Container>
	);
}
