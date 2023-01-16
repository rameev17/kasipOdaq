import React, {Component} from 'react';
import {ReactComponent as RemoveIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as AppendIcon} from '../../assets/icons/clip.svg'

class AddDocument extends Component {

    state = {
        name: '',
        file: null,
        formData: null
    }

    handleChangeName = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    render() {

        return (
            <div className='add-document plate-wrapper'>
               <div className="name">
                   <span>Название</span>
                   <input type="text" name="name"
                          value={this.state.name}
                          onChange={this.handleChangeName}
                          placeholder='Заполните поле'/>
               </div>
               <div className="document-container">
                   <span>Прикрепите документ</span>
                   <label className="document">
                       <div className="placeholder">
                           Прикрепить файл
                       </div>
                       <div className="placeholder">
                           file
                       </div>

                       <div className="icons__wrapper">

                           <div className="icon remove">
                               <RemoveIcon/>
                           </div>

                           <div className="icon append">
                               <AppendIcon/>
                           </div>
                       </div>
                       <input type="file" name="document"
                              style={{display: 'none'}}/>
                   </label>

               </div>
               <button className='add-file'>Добавить документ</button>
            </div>
        );
    }
}

export default AddDocument;