import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import * as DropdownMenu from 'zeego/dropdown-menu';
import Colors from '@/constants/Colors';
import { SFSymbols6_0 } from 'sf-symbols-typescript';

export type DropDownMenuProps = {
    items: Array<{
        key: string;
        title: string;
        icon: string;
    }>;
    onSelect: (key: string) => void;
};

const DropDownMenu: React.FC<DropDownMenuProps> = ({ items, onSelect }) => {
  return (
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <Ionicons name="ellipsis-horizontal" size={24} color={Colors.white} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            {items.map((item) => (
                <DropdownMenu.Item key={item.key} onSelect={() => onSelect(item.key)}>
                    <DropdownMenu.ItemTitle>{item.title}</DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon
                        ios={{
                            name: item.icon as SFSymbols6_0,
                            pointSize: 18,
                        }}/>
            </DropdownMenu.Item>
            ))}
        </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default DropDownMenu