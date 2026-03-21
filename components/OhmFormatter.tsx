import { Text, TextProps } from 'react-native';

import { formatResistance } from '../utils/formatResistance';
import { typography } from '../constants/theme';

type OhmFormatterProps = {
  value: number;
} & TextProps;

export function OhmFormatter({ value, style, ...props }: OhmFormatterProps) {
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: typography.mono,
        },
        style,
      ]}
    >
      {formatResistance(value)}
    </Text>
  );
}
