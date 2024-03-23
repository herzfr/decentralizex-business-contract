import React from "react";
import './alert.css'

function AlertComponent({ type, message, head, onClick }) {
    const refType = [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
    ]

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    }

    const getstyles = () => {
        switch (type) {
            case 'success':
                return {
                    box: 'dcx-alert-success',
                    icon: (<i className="bi bi-hand-thumbs-up-fill dcx-text-success"></i>),
                    text: 'dcx-text-success'
                };
            case 'danger':
                return {
                    box: 'dcx-alert-danger',
                    icon: (<i class="bi bi-exclamation-circle-fill dcx-text-danger"></i>),
                    text: 'dcx-text-danger'
                };
            case 'warning':
                return {
                    box: 'dcx-alert-warning',
                    icon: (<i className="bi bi-cone-striped dcx-text-warning"></i>),
                    text: 'dcx-text-warning'
                };
            case 'info':
                return {
                    box: 'dcx-alert-info',
                    icon: (<i className="bi bi-cone-striped dcx-text-info"></i>),
                    text: 'dcx-text-info'
                };
            default:
                return {
                    box: 'dcx-alert-info',
                    icon: (<i class="bi bi-info-circle-fill dcx-text-info"></i>),
                    text: 'dcx-text-info'
                };
        }
    }

    return (
        <div className={`alert-message ${getstyles().box}`}>
            <button onClick={handleClick} className="btn-close-alert"><i className="bi bi-x-square-fill"></i></button>
            {head && head !== "" && <div className="alert-head-container">{getstyles().icon}<p className={`alert-head ${getstyles().text}`}>{head}</p></div>}
            {message && message !== "" && <span className={`alert-text ${getstyles().text}`}>{message}</span>}
        </div>
    );
}

export default AlertComponent;