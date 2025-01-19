import {NavLink} from 'react-router-dom'
import {Video, Wrench, Settings, Home} from 'lucide-react'

const routes = [
    {name: 'Home', path: '/', icon: Home},
    {
        name: 'Pipelines',
        items: [
            {name: 'Top 5 pipeline', path: '/pipelines/top-5', icon: Video},
        ]
    },
    {
        name: 'Tools',
        items: [
            {name: 'Long to shorts', path: '/tools/long-to-shorts', icon: Wrench},
        ]
    },
    {name: 'Secrets', path: '/secrets', icon: Settings},
]

export function AppSidebar() {
    return (
        <aside className="fixed w-64 h-screen border-r">
            <div className="h-[64px] flex items-center px-6">
                <span className="text-xl font-semibold">
                    <NavLink to={'/'} className="font-bold text-xl">Persona AI Studio</NavLink>
                </span>
            </div>
            <nav className="px-4 py-4 h-full">
                {routes.map((route, index) => (
                    <div key={route.name} className="mb-4">
                        {route.items ? (
                            <>
                                <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {route.name}
                                </h3>
                                {route.items.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        className={({isActive}) =>
                                            `flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out ${
                                                isActive
                                                    ? 'bg-secondary text-secondary-foreground'
                                                    : 'hover:bg-accent hover:text-accent-foreground'
                                            }`
                                        }
                                    >
                                        <item.icon className="mr-3 h-4 w-4"/>
                                        {item.name}
                                    </NavLink>
                                ))}
                            </>
                        ) : (
                            <NavLink
                                to={route.path}
                                className={({isActive}) =>
                                    `flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out ${
                                        isActive
                                            ? 'bg-secondary text-secondary-foreground'
                                            : 'hover:bg-accent hover:text-accent-foreground'
                                    } 
                                    `
                                }
                            >
                                <route.icon className="mr-3 h-4 w-4"/>
                                {route.name}
                            </NavLink>
                        )}
                        {index < routes.length - 1 && (
                            <div className="my-4 border-b"/>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    )
}

