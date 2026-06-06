import Svg, { Circle, Path } from 'react-native-svg';

import {
  iconRegistry,
  resolveIconKey,
  type AppIconName,
  type IconDefinition,
  type IconKey,
  type IconNode,
} from '../../assets/icons';

export type IconName = AppIconName;
export type { IconKey };

type AppIconProps = {
  name: IconName;
  size: number;
  color: string;
};

function currentColor(value: IconNode['stroke'] | undefined, color: string) {
  return value === 'currentColor' ? color : undefined;
}

export function AppIcon({ color, name, size }: AppIconProps) {
  const icon = iconRegistry[resolveIconKey(name)] as IconDefinition;

  return (
    <Svg width={size} height={size} viewBox={icon.viewBox}>
      {icon.nodes.map((node, index) => {
        if (node.type === 'circle') {
          return (
            <Circle
              key={index}
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill={node.fill === 'none' ? 'none' : color}
              opacity={node.opacity ?? 1}
              stroke={currentColor(node.stroke, color)}
              strokeWidth={node.strokeWidth}
            />
          );
        }

        return (
          <Path
            key={index}
            d={node.d}
            fill={node.fill === 'none' ? 'none' : color}
            fillRule={node.fillRule ?? 'nonzero'}
            opacity={node.opacity ?? 1}
            stroke={currentColor(node.stroke, color)}
            strokeLinecap={node.strokeLinecap}
            strokeLinejoin={node.strokeLinejoin}
            strokeWidth={node.strokeWidth}
          />
        );
      })}
    </Svg>
  );
}
