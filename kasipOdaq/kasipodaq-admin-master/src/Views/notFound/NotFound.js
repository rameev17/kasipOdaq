import React, {Component} from 'react';
import Layout from "../Containers/Layout";
import {Link} from 'react-router-dom'
import {ReactComponent as LogoIcon} from '../../assets/icons/logo.svg'

class NotFound extends Component {
    render() {
        return (
            <Layout title='Страница не найдена'>
                <div className="page-404">
                    <LogoIcon/>
                    <h1 className="title">404</h1>
                    <h2>Страница не найдена</h2>
                    <Link to='/'>Перейти на главную страницу</Link>
                </div>
            </Layout>
        );
    }
}

export default NotFound;