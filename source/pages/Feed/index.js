import React from 'react';
import { FlatList } from 'react-native';

import LazyImage from '../../components/LazyImage';
import {
  Post,
  Name,
  Header,
  Avatar,
  Loading,
  FeedEnd,
  Container,
  Description,
  FeedEndText,
  FeedEndTitle,
} from './styles';

const FEED_URL = 'http://localhost:3000/feed';

export default function Feed() {
  const [page, setPage] = React.useState(1);
  const [feed, setFeed] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [viewableItems, setViewableItems] = React.useState([]);

  async function loadPage(pageNumber = page, shouldRefresh = false) {
    if (loading || pageNumber === total) {
      return;
    }

    setLoading(true);

    const response = await fetch(
      `${FEED_URL}?_expand=author&_limit=5&_page=${page}`,
    );

    const data = await response.json();
    const totalCount = response.headers.get('X-Total-Count');

    setLoading(false);

    setPage(pageNumber + 1);
    setTotal(Math.ceil(totalCount / 5));

    setFeed(shouldRefresh ? data : [...feed, ...data]);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadPage(1, true);
    setRefreshing(false);
  }

  React.useEffect(() => {
    loadPage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleViewableItemsChanged = React.useCallback(({ changed }) => {
    setViewableItems(changed.map(({ item }) => item.id));
  }, []);

  const hasMorePages = total !== page;

  return (
    <Container>
      <FlatList
        data={feed}
        keyExtractor={item => String(item.id)}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={() => loadPage()}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loading && hasMorePages ? (
            <Loading />
          ) : (
            <FeedEnd>
              <FeedEndTitle>Você chegou ao fim!</FeedEndTitle>
              <FeedEndText>Tudo o que é bom dura pouco, né?</FeedEndText>
            </FeedEnd>
          )
        }
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 10,
        }}
        renderItem={({ item }) => (
          <Post>
            <Header>
              <Avatar source={{ uri: item.author.avatar }} />
              <Name>{item.author.name}</Name>
            </Header>
            <LazyImage
              source={{ uri: item.image }}
              shouldLoad={viewableItems.includes(item.id)}
              smallSource={{ uri: item.small }}
              aspectRatio={item.aspectRatio}
            />
            <Description>
              <Name>{item.author.name}</Name> {item.description}
            </Description>
          </Post>
        )}
      />
    </Container>
  );
}
