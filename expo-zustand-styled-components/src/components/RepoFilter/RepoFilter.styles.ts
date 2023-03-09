import styled from 'styled-components/native';
import { colors } from '../../utils/style-variables';
import {breakpoints} from '../../utils/breakpoints';

type ScreenWidth = {
  screenWidth: number | undefined;
};

export const RepoFilterWrapper = styled.View<ScreenWidth>`
  flex-direction: ${({screenWidth}) => screenWidth >= breakpoints.laptop ? 'row' : 'column'}
  gap: 14px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${colors.gray300};
  padding-bottom: 14px;
`;

export const FilterTextWrapper = styled.View`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${colors.gray300};
  margin-top: 14px;
  padding-bottom: 14px;
  flex-direction: row;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
`;

export const FilterTextContent = styled.View`
  flex-direction: row;
  gap: 4px;
  align-items: center;
  flex-wrap: wrap;
  flex-grow: 1;
`;

export const FiltersWrapper = styled.View<ScreenWidth>`
  flex-direction: ${({screenWidth}) => screenWidth >= breakpoints.tablet ? 'row' : 'column'}
  gap: 4px;
  z-index: 500;
  elevation: 500;
`;

export const SearchTextInput = styled.TextInput`
  width: 100%;
  border: 1px solid ${colors.gray300};
  padding: 8px 12px;
  border-radius: 8px;
  color: ${colors.gray500};
  background-color: #FFF;
  font-size: 16px;
`;

export const RepoBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 6px;
  padding: 6px 12px;
  background-color: ${colors.primaryGreen};
`;

export const RepoBtnText = styled.Text`
  color: #FFF;
  font-weight: 700;
  font-size: 14px;
`;


export const ClearFilter = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const ClearIcon = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${colors.blue600};
  border-radius: 8px;
  width: 25px;
  height: 25px;
`;

export const ClearText = styled.Text<ScreenWidth>`
  display: ${({screenWidth}) => screenWidth > breakpoints.tablet ? 'flex' : 'none'};
  color:  ${colors.blue600};
`;