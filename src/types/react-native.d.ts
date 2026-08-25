/**
 * React Native ambient type declarations for Expo/React Native TypeScript validation
 */

declare module 'react-native' {
  import * as React from 'react';

  export interface ViewStyle {
    [key: string]: any;
  }
  export interface TextStyle {
    [key: string]: any;
  }
  export interface ImageStyle {
    [key: string]: any;
  }

  export type StyleProp<T> = T | Array<T | undefined | null | false>;

  export interface ViewProps {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    accessibilityRole?: string;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    [key: string]: any;
  }

  export interface TextProps {
    style?: StyleProp<TextStyle>;
    children?: React.ReactNode;
    numberOfLines?: number;
    accessibilityRole?: string;
    accessibilityLabel?: string;
    [key: string]: any;
  }

  export interface TextInputProps {
    style?: StyleProp<TextStyle>;
    placeholder?: string;
    placeholderTextColor?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    returnKeyType?: string;
    autoCorrect?: boolean;
    autoCapitalize?: string;
    accessibilityLabel?: string;
    [key: string]: any;
  }

  export interface PressableProps {
    style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
    onPress?: () => void;
    children?: React.ReactNode | ((state: { pressed: boolean }) => React.ReactNode);
    accessibilityRole?: string;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    [key: string]: any;
  }

  export interface FlatListProps<T> {
    data: T[] | null | undefined;
    renderItem: (info: { item: T; index: number }) => React.ReactElement | null;
    keyExtractor?: (item: T, index: number) => string;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
    ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
    contentContainerStyle?: StyleProp<ViewStyle>;
    refreshControl?: React.ReactElement | null;
    [key: string]: any;
  }

  export interface RefreshControlProps {
    refreshing: boolean;
    onRefresh?: () => void;
    colors?: string[];
    tintColor?: string;
    [key: string]: any;
  }

  export interface ActivityIndicatorProps {
    size?: 'small' | 'large' | number;
    color?: string;
    style?: StyleProp<ViewStyle>;
    [key: string]: any;
  }

  export interface StatusBarProps {
    barStyle?: 'default' | 'light-content' | 'dark-content';
    backgroundColor?: string;
    translucent?: boolean;
    [key: string]: any;
  }

  export const View: React.FC<ViewProps>;
  export const Text: React.FC<TextProps>;
  export const TextInput: React.FC<TextInputProps>;
  export const Pressable: React.FC<PressableProps>;
  export const ScrollView: React.FC<ViewProps>;
  export const SafeAreaView: React.FC<ViewProps>;
  export class FlatList<T = any> extends React.Component<FlatListProps<T>> {}
  export const RefreshControl: React.FC<RefreshControlProps>;
  export const ActivityIndicator: React.FC<ActivityIndicatorProps>;
  export const StatusBar: React.FC<StatusBarProps>;

  export const StyleSheet: {
    create<T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(styles: T): T;
  };

  export const Linking: {
    canOpenURL(url: string): Promise<boolean>;
    openURL(url: string): Promise<any>;
  };

  export const Platform: {
    OS: 'ios' | 'android' | 'web';
    select<T>(specifics: { ios?: T; android?: T; web?: T; default?: T }): T;
  };
}
