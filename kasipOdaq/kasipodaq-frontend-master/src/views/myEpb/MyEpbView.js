import React, {Component} from 'react';
import Layout from '../../fragments/layout/Layout'
import {Switch, Redirect, Route, Link} from 'react-router-dom'

import {ReactComponent as MarkIcon} from '../../assets/icons/exclamation-mark.svg'

import './style.scss';
import moment from 'moment';
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Preloader from "../../fragments/preloader/Preloader";
import CookieService from "../../services/CookieService";


class MyEpb extends Component{
    constructor(props){
        super(props)

        this.state = {
            title: '',
            text: '',
            preloader: false,
        }

    }


    render(){

        return(
            <Switch>
                <Route exact path='/epb' render={props => {return <MyEpbInfo {...props}/>}}/>
                <Route exact path='/epb/cart' render={props => {return <MyEpbCart {...props}/>}}/>
                <Route exact path='/epb/qr' render={props => {return <MyEpbQR {...props}/> }}/>
                <Route exact path='/epb/how-it-works' render={props => {return <MyEpbHow {...props}/> }}/>
            </Switch>
        )
    }
}

const MyEpbInfo = inject('userStore', 'permissionsStore')(observer(class MyEpbInfo extends Component {

    state = {
        title: '',
        text: ''
    }

    componentDidMount() {

        const title = this.props.userStore.languageList["Электронный профсоюзный билет"] || 'Электронный профсоюзный билет'
        const textRu = 'Электронный профсоюзный билет - представляет собой персонализированную цифровую карту, удостоверяющую Ваше  членство в  профсоюзе. Выдаётся комитетом первичной профсоюзной организации. ЭПБ предоставляет члену профсоюза получать преференции в виде скидок на товары и услуги в сети Партнёров профсоюзных организаций.\n' +
            'ЭПБ имеет единый вид для всех профсоюзных организаций. Приоритетные партнёры: сети АЗС, сети супермаркетов, автобусные парки, сети аптек, спортивные и оздоровительные учреждения и т.д.\n' +
            '\n' +
            'Электронный профсоюзный билет готов к использованию уже с момента\n' +
            'его получения и не требует дополнительной активации.\n' +
            '\n' +
            'Для получения скидки Вам необходимо:\n' +
            '\n' +
            '1. Получить Электронный профсоюзный билет в своей профсоюзной организации.\n' +
            '\n' +
            '2. Предъявить Электронный профсоюзный билет при оплате товара или\n' +
            'услуги в торгово- сервисном предприятии - партнере программы "Электронный профсоюзный билет".\n' +
            '\n' +
            '3. При заказе товара или услуги в интернет-магазине Вам необходимо указать данные своего Электронного профсоюзного билета в комментариях к заказу или сообщить о его наличии оператору этого интернет-магазина.\n' +
            '\n' +
            'Для получения подробной информации о текущих акциях и предложениях\n' +
            'для членов профсоюзных организаций просим Вас перейти в раздел\n' +
            'Партнеры.'

        const textKk = 'Электрондық кәсіподақ билеті-сіздің кәсіподаққа мүшелігіңізді куәландыратын жеке сандық карта. ' +
            'Бастауыш кәсіподақ ұйымының комитеті береді. ЭББ кәсіподақ мүшесіне кәсіподақ ұйымдары серіктестерінің желісінде тауарлар ' +
            'мен қызметтерге жеңілдіктер түрінде преференциялар алуға мүмкіндік береді. ЭББ барлық кәсіподақ ұйымдары үшін бірыңғай түрге ие. ' +
            'Басым серіктестер: ЖҚС, супермаркеттер, автобус парктері, дәріханалар, спорттық және сауықтыру мекемелері және т. б. желілері. ' +
            'Электрондық кәсіподақ билеті оны алған сәттен бастап пайдалануға дайын және қосымша белсендіруді талап етпейді. ' +
            'Жеңілдік алу үшін сізге: 1. Өзіңіздің кәсіподақ ұйымыңыздан электронды кәсіподақ билетін алыңыз. ' +
            '2. "Электрондық кәсіподақ билеті"бағдарламасының серіктес сауда - сервистік кәсіпорнында тауарға немесе қызметке ақы төлеу кезінде электрондық кәсіподақ билетін ұсыну қажет.' +
            ' 3. Интернет-дүкенде тауарға немесе қызметке тапсырыс беру кезінде сіз тапсырысқа түсініктемелерде өзіңіздің электрондық кәсіподақ билетіңіздің деректерін көрсетуіңіз немесе оның бар екендігі ' +
            'туралы осы интернет-дүкеннің операторына хабарлауыңыз қажет. Кәсіподақ ұйымдарының мүшелері үшін ағымдағы акциялар мен ұсыныстар туралы толық ақпарат алу үшін серіктестер бөліміне өтуді сұраймыз.'

        this.setState({
            title: title,
            text: CookieService.get('language') == 'kk' ? textKk : textRu
        })
    }

    render() {
        return (
            <Layout title='ЭПБ'>
                <div className="plate-wrapper plate-wrapper__height">
                    <div className='epb-info'>
                        <div className="epb-info__wrapper">
                            <h1 className="title">{ this.state.title }</h1>
                            {
                                this.props.permissionsStore.hasPermission('union_card', 'get_by_id') &&
                                <Link to='/epb/cart' className="epb-info__link">
                                    {this.props.userStore.languageList["Мой электронный профсоюзный билет"] || 'Мой электронный профсоюзный билет'}
                                </Link>
                            }
                        </div>
                        <div className="text">
                            { this.state.text }
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}))

const MyEpbCart = inject('userStore', 'permissionsStore')(observer(class MyEpbCart extends Component{

    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
            birthday: 0,
        }

        this.handleQRClick = this.handleQRClick.bind(this)
    }

    componentDidMount() {
        this.props.userStore.profileInfo((data) => {
            this.setState({
                preloader: false,
                birthday: data.birthday
            })

        },response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false })
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloader: false })
                NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        })
    }

    handleQRClick = () => {
        this.props.history.push('/epb/qr')
    }

    render(){
        const BREAD_CRUMBS =
            [
                {
                    label:'Электронный профсоюзный билет ',
                    link:'/epb'
                },
                {
                    label:'Мой билет',
                    link:'/epb/cart'
                }
            ];

        return(
            <Layout title='мой ЭПБ'>
                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="plate-wrapper plate-wrapper__height">

                <div style={{ marginBottom: 16 }}>
                    <Link style={{ color: '#0052A4' }} to={'/epb'}>{this.props.userStore.languageList['Электронный профсоюзный билет'] || 'Электронный профсоюзный билет' }</Link>
                    <span> -> </span>
                    <Link style={{ color: '#0052A4', borderBottom: '1px solid #0052A4' }}>{this.props.userStore.languageList['Мой ЭПБ'] || 'Мой ЭПБ'}</Link>
                </div>

                    <div className='epb-cart'>
                        <a href="https://storage.kasipodaq.org/a7db61ae11152a6a9678a4e31621c75d.docx" target="_blank" className="download__link">{this.props.userStore.languageList["Правила участия в программе"] || 'Правила участия в программе'}</a>
                        <div className="cart__wrapper">
                            <div className="cart-front cart-front-background">
                                <div className="cart-front-logo"/>
                                <div className="cart-front-title">
                                    <div className="cart-front-title-kz">
                                        <p>Elektrondy kasipodaq bileti</p>
                                    </div>
                                    <div className="cart-front-title-ru">
                                        <p>{this.props.userStore.languageList["Электронный профсоюзный билет"] || 'Электронный профсоюзный билет'}</p>
                                    </div>
                                </div>
                                <div className="cart-front-content">
                                    <div className='cart-front-img'
                                         style={{background: (this.props.userStore.profile.picture_uri ? `url(${this.props.userStore.profile.picture_uri}) no-repeat center center/ cover` : '' )}}>
                                    </div>
                                    <div className="cart-front-info">
                                        <p>{this.props.userStore.profile.uid}</p>
                                        <span>aı/jyl</span>
                                        <span>месяц/год</span>
                                        <span>
                                            {
                                                moment(new Date(this.props.userStore.profile.union.join_date)).format('MM/YYYY')
                                            }
                                        </span>
                                        {/*<p>{this.props.userStore.join_date}</p>*/}
                                        <p>{ `${this.props.userStore.profile.first_name} ${this.props.userStore.profile.family_name}` }</p>
                                    </div>
                                </div>

                                <div className="cart-front-bottom">
                                    <p>Karta kásіpodaq uıymynyń menshіgі bolyp tabylady jáne kásіpodaq komıtetіnіń sheshіmі boıynsha alynýy múmkіn</p>
                                    <p>Карта является собственностью профсоюзной организации и может быть изъята по решению профкома</p>
                                </div>
                            </div>
                            <div className="cart-back" onClick={this.handleQRClick}>
                                <div className="cart-back-background">
                                    <div className="cart-back-content">
                                        <div className="cart-back-qr-code"
                                             style={{background: (`url(${this.props.userStore.profile.qr_uri}) no-repeat center center/ cover`) }}>
                                            <img src={''} alt=""/>
                                        </div>
                                        <div className="cart-back-content-right">
                                            <div className="cart-back-logo">
                                                <img src={''} alt=""/>
                                            </div>
                                            <div className="cart-back-content-right-info">
                                                <p>yntymaq2019@mail.ru</p>
                                                <p>+7 7172 21-53-77</p>
                                                <p>yntymaq2019@mail.ru</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cart-back-bottom-info">
                                        <ul>
                                            <li>Karta QR KF menshigi bolyp tabyldy;</li>
                                            <li>Kasipodaq uiymyn esepten shygary kezinde(jumystan shygary/shygy) karta iesi ony ozinin bastapqy uiymyna tapsyryga mindetti;</li>
                                            <li>Bul karta QRKF Seriktesteri jelilerinde jenildikter men preferentsiialar alyga quqyq beredi;</li>
                                            <li>Otkiziletin aktsiialar, jenildikter tyraly aqparatty Siz bizdin saittan bile alasyz</li>
                                        </ul>
                                        <ul>
                                            <li>Карта является собственностью ФПРК;</li>
                                            <li>При снятии с учёта Профсоюзной организации (увольнение/выход) владелец карты обязан сдать ее в свою Первичную орагнизацию;</li>
                                            <li>Данная карта даёт право на получение скидок и преференций в сетях Партнёров ФПРК;</li>
                                            <li>Инофрмацию о скидках, проводимых акциях Вы можете узнать на нашем сайте</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="info">
                            <div className="icon">
                                <MarkIcon/>
                            </div>
                            <div className="text">
                                {this.props.userStore.languageList["Нажмите на QR-код чтобы его увеличить"] || 'Нажмите на QR-код чтобы его увеличить'}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}))

const MyEpbQR = inject('userStore', 'permissionsStore')(observer(class MyEpbQR extends Component{

    render(){
        const BREAD_CRUMBS =
            [
                {
                    label:'Электронный профсоюзный билет ',
                    link:'/epb'
                },
                {
                    label:'Мой билет',
                    link:'/epb/cart'
                },
                {
                    label:'Мой qr код',
                    link:'/epb/qr'
                }
            ];

        return(
            <Layout title='мой ЭПБ'>
                <div className="plate-wrapper plate-wrapper__height">

                    <div style={{ marginBottom: 16 }}>
                        <Link style={{ color: '#0052A4' }} to={'/epb'}>{this.props.userStore.languageList['Электронный профсоюзный билет'] || 'Электронный профсоюзный билет'}</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4'}} to={'/epb/cart'}>{this.props.userStore.languageList['Мой ЭПБ'] || 'Мой ЭПБ'}</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4', borderBottom: '1px solid #0052A4' }}>{this.props.userStore.languageList['Мой QR'] || 'Мой QR'}</Link>
                    </div>

                    <div className="epb-qr">
                        <h1 className="title">{this.props.userStore.languageList["Мой QR-код"] || 'Мой QR-код'}</h1>
                        <div className='epb-qr__img'>
                            <img src={this.props.userStore.profile.qr_uri} width='290' alt=""/>
                        </div>
                        <Link to="/epb/how-it-works" className="how-it-works">{this.props.userStore.languageList["Как это работает?"] || 'Как это работает?'}</Link>
                    </div>
                </div>
            </Layout>
        )
    }
}))

const MyEpbHow = inject('userStore', 'permissionsStore')(observer(class MyEpbHow extends Component{

    state = {
        text: ''
    }

    componentDidMount() {

        this.setState({
            text: 'Для того чтобы воспользоваться скидочной (льготной) системой Вам необходимо предъявить свой QR код в своём мобильном Приложении Партнёру программы.  \n' +
                '\n' +
                'Владелец карты может НАКАПЛИВАТЬ БОНУСЫ  по курсу 1 тенге = 1 бонус при оплате товаров, работ или услуг по общеустановленным ценам Партнеров. Например, после оплаты общеустановленной цены 1000 тенге, на баланс его карты автоматически начисляется бонус 100% CASHBACK в размере 1000 тенге. Для подтверждения платежа и накопления бонусов, Владелец карты делает фотоснимок фискального чека/платежного поручения и отправляет его со своей карты через любой смартфон. Единый расчётный центр ФПРК при  получает сообщение и начисляет на баланс карты эквивалентную сумму покупки, т.е. 100% CASHBACK в размере 1000 тенге.\n' +
                '\n' +
                '  Владелец карты может ПОТРАТИТЬ БОНУСЫ или ПОЛУЧИТЬ ПРЯМЫЕ СКИДКИ по курсу 1 бонус = 1 тенге при оплате стоимости товаров, работ и услуг в предприятиях Партнеров ФПРК (в пределах льгот, оговоренных с Партнером). Например, если общая сумма к оплате 1000 тенге, то часть суммы оплачивается в тенге, а часть (оговоренная с Партнером от 5% до 100%) оплачивается бонусами. Для списания бонусов с карты, Партнер вводит сумму принятых бонусов (предоставленных льгот/скидок) и погашает ее с баланса карты.\n' +
                '\n' +
                '   Данная бонусная система выгодна тем, что оплачивая определенный товар, работу или услугу, член профсоюза, не всегда желает получать скидку на определенный товар или приобретать товар именно в этом предприятии. Членам профсоюзов ФПРК предоставляется возможность накапливать 100%CASHBACK, а в дальнейшем тратить накопленные бонусы на другие более важные и необходимые товары, работы или услуги в любом из множества предприятий Партнеров ФПРК по всему Казахстану.\n' +
                '\n' +
                '  В случае если член профсоюза не имеет возможности предъявить QR код со своего мобильного Приложения он также равноправно может предъявить Партнёру свой профсоюзный билет.\n'
        })
    }

    render(){
        const BREAD_CRUMBS =
            [
                {
                    label:'Электронный профсоюзный билет ',
                    link:'/epb'
                },
                {
                    label:'Мой билет',
                    link:'/epb/cart'
                },
                {
                    label:'Мой qr код',
                    link:'/epb/qr'
                },
                {
                    label:'Как это работает?',
                    link:'/epb/how-it-works'
                }
            ];

        return(
            <Layout title='мой ЭПБ'>
                <div className="plate-wrapper plate-wrapper__height">

                    <div style={{ marginBottom: 16 }}>
                        <Link style={{ color: '#0052A4' }} to={'/epb'}>{this.props.userStore.languageList['Электронный профсоюзный билет'] || 'Электронный профсоюзный билет'}</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4'}} to={'/epb/cart'}>{this.props.userStore.languageList['Мой ЭПБ'] || 'Мой ЭПБ'}</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4' }} to={'/epb/qr'}>{this.props.userStore.languageList['Мой QR'] || 'Мой QR'}</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4', borderBottom: '1px solid #0052A4' }}>{this.props.userStore.languageList['Как это работает?'] || 'Как это работает?'}</Link>
                    </div>

                    <div className="epb-how">
                        <h1 className="title">{this.props.userStore.languageList["Как это работает?"] || 'Как это работает?'}</h1>
                        <div className='text'>
                            {this.state.text}
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}))

export default inject('userStore', 'permissionsStore')(observer(MyEpb));