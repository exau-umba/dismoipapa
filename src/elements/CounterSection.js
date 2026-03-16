import React, { useEffect, useMemo, useState } from 'react';
import CountUp from 'react-countup';

import { fetchBooks } from '../api/catalog';
import { listCatalogs, listUsers } from '../api/admin';

const CounterSection = () =>{
    const [usersCount, setUsersCount] = useState(null);
    const [booksCount, setBooksCount] = useState(null);
    const [catalogsCount, setCatalogsCount] = useState(null);

    useEffect(() => {
        let mounted = true;

        fetchBooks()
            .then((books) => {
                if (!mounted) return;
                setBooksCount(Array.isArray(books) ? books.length : 0);
            })
            .catch(() => {
                if (!mounted) return;
                setBooksCount(0);
            });

        listCatalogs()
            .then((catalogs) => {
                if (!mounted) return;
                setCatalogsCount(Array.isArray(catalogs) ? catalogs.length : 0);
            })
            .catch(() => {
                if (!mounted) return;
                setCatalogsCount(0);
            });

        // Peut échouer si l’API restreint cette route (selon auth/permissions)
        listUsers()
            .then((users) => {
                if (!mounted) return;
                setUsersCount(Array.isArray(users) ? users.length : 0);
            })
            .catch(() => {
                if (!mounted) return;
                setUsersCount(0);
            });

        return () => {
            mounted = false;
        };
    }, []);

    const counterBlog = useMemo(() => ([
        { iconClass: 'fa-users', number: usersCount, title: 'Clients satisfaits' },
        { iconClass: 'fa-book', number: booksCount, title: 'Livres en catalogue' },
        { iconClass: 'fa-store', number: catalogsCount, title: 'Catalogues de livres' },
    ]), [usersCount, booksCount, catalogsCount]);

    return(
        <>
            {counterBlog.map((data, i)=>(
                <div className="col-lg-4 col-md-6 col-sm-6 col-6" key={i} >
                    <div className="icon-bx-wraper style-2 m-b30 text-center">
                        <div className="icon-bx-lg">
                            <i className={`fa-solid icon-cell ${data.iconClass}`}></i>
                        </div>
                        <div className="icon-content">
                            <h2 className="dz-title counter m-b0">
                                {typeof data.number === 'number' ? (
                                    <CountUp end={data.number} separator="," duration={3} />
                                ) : (
                                    '—'
                                )}
                            </h2>
                            <p className="font-20">{data.title}</p>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}
export default CounterSection;