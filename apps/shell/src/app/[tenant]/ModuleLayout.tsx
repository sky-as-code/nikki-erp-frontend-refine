'use client';

import { ActionIcon, Avatar, Breadcrumbs, Button, Group, Stack, useMantineColorScheme } from '@mantine/core';
import { IconChevronDown, IconMoonStars, IconPalette, IconSun } from '@tabler/icons-react';
import clsx from 'clsx';
import { createContext, useContext, useState } from 'react';

import classes from './ModuleLayout.module.css';

import { useUIState } from '@/common/context/UIProviders';
import { MenuBar } from '@/components/MenuBar';
import { ModuleSwitchDropdown } from '@/modules/core/organization/ModuleSwitchDropdown';
import { OrgSwitchDropdown } from '@/modules/core/organization/OrgSwitchDropdown';
import { NavItem } from '@/types/navItem';


export type LayoutSplitMode = '3_7' | '1_9' | '10_0' | '0_10';

export type ModuleLayoutContextType = {
	is3_7: boolean,
	is1_9: boolean,
	is0_10: boolean,
	is10_0: boolean,
	setSplitMode: (mode: LayoutSplitMode) => void,
};

const ModuleLayoutContext = createContext<ModuleLayoutContextType | undefined>(undefined);

export const useModuleLayout = (): ModuleLayoutContextType => {
	const context = useContext(ModuleLayoutContext);
	if (!context) {
		throw new Error('useModuleLayout must be used within ModuleLayoutProvider');
	}
	return context;
};

export type ModuleLayoutProps = React.PropsWithChildren<{
	navItems: NavItem[];
}>;

export const ModuleLayout: React.FC<ModuleLayoutProps> = ({
	children,
	navItems,
}) => {
	const { backgroundColor } = useUIState();
	const [splitMode, setSplitMode] = useState<LayoutSplitMode | null>(null);

	const contextValue: ModuleLayoutContextType = {
		is3_7: splitMode === '3_7',
		is1_9: splitMode === '1_9',
		is0_10: splitMode === '0_10',
		is10_0: splitMode === '10_0',
		setSplitMode,
	};

	return (
		<ModuleLayoutContext.Provider value={contextValue}>
			<Stack
				component='div'
				bg={backgroundColor}
				gap={0}
				className='module-layout h-screen'
			>
				<Header navItems={navItems} />
				<Group
					component='div'
					gap={0}
					className='flex-1'
				>
					{children}
				</Group>
			</Stack>
		</ModuleLayoutContext.Provider>
	);
};

const Header: React.FC<{ navItems: NavItem[] }> = ({ navItems }) => {
	const { isMobile } = useUIState();

	if (isMobile) return null;

	return (
		<Group
			component='header'
			align='center'
			justify='space-between'
			gap={0}
			className={clsx(
				'w-full h-[50px] shrink-0 z-100 px-4',
				classes.headerRow,
				classes.menuBar,
			)}
		>
			<Group
				component='section'
				align='center'
				justify='flex-start'
				gap={0}
				className={'flex flex-row items-center justify-start'}
			>
				<Breadcrumbs separatorMargin='xs'>
					<OrgSwitchDropdown dropdownWidth={300} />
					<ModuleSwitchDropdown dropdownWidth={300} />
				</Breadcrumbs>
				<MenuBar items={navItems} />
			</Group>
			<Group
				component='section'
				align='center'
				justify='flex-end'
				gap='sm'
			>
				<ThemeSwitcher />
				<ActionIcon variant='subtle' size='compact-md'>
					<Avatar size={50} />
				</ActionIcon>
			</Group>
		</Group>
	);
};

const ThemeSwitcher: React.FC = () => {
	const { colorScheme, setColorScheme } = useMantineColorScheme();
	return (
		<Button
			variant='subtle'
			size='compact-md'
			rightSection={<IconChevronDown size={20} />}
		>
			{/* <IconPalette /> */}
			{(colorScheme === 'dark') && <IconMoonStars onClick={() => setColorScheme('light')} />}
			{(colorScheme === 'light') && <IconSun onClick={() => setColorScheme('dark')} />}
		</Button>
	);
};