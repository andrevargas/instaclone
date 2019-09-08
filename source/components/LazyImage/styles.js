import styled from 'styled-components/native';

export const Small = styled.ImageBackground`
  width: 100%;
  background: #eee;
  align-items: center;
  justify-content: center;
  aspect-ratio: ${props => props.aspect};
`;

export const Original = styled.Image`
  width: 100%;
  aspect-ratio: ${props => props.aspect};
`;

export const Loading = styled.ActivityIndicator.attrs({
  size: 40,
  color: 'rgba(255, 255, 255, 0.2)',
})``;
