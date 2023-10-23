import React, { useState } from 'react'
import mpesa from './assets/MPESA.png'
import masterCard from './assets/mastercard.png'
import paypal from './assets/paypal.png'
import Bag from './assets/Bag.png'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import {TailSpin} from 'react-loader-spinner'
import axios from 'axios'

const Product = ({ image, Description, Price, Quantity}) => {
    return(
        <div className='product flex flex-row p-3 mb-2 items-end'>
            <img
                src={image}
                width={40}
                height={10}
                className='img mr-[3rem]'
            />
            <div className='info flex flex-col'>
                <h5 className='description text-[13px]'>
                    {Description}
                </h5>
                <small>{Price}</small>
                <small>Quantity: {Quantity}</small>
            </div>
        </div>
    )
}

function App() {
    const [ loading, setLoading ] = useState(false)
    const [ form, setForm ] = useState({ phone: '', email: '' })
    const [ editable, setEditable ] = useState(true)
    const [ empty, setEmpty ] = useState(false)

    const url = 'http://localhost:3000/stkTill'

    const handleSubmit = async (e) => {
        e.preventDefault(), setLoading(true)
        let phoneNumber = parseInt(form.phone, 10)
        const number = "254" + phoneNumber
        if(!form.email || !form.phone) {
            setEmpty(true)
            setLoading(false)
        }else {
            const response = await axios.post(url, {phone: number, amount: 1, email: form.email})
            if(response.status === 200){
                console.log('It has been sent')
                setTimeout(() => {
                    setLoading(false)
                    setForm({phone: '', email: ''})
                }, 3000)
            } else if(response.status === 500){
                setLoading(false)
                console.log('Iternal Server Error')
            }
        }
    }
    

    const Products = [
        {img: Bag, desc: 'Half Moon 35L Water Resistant 15.6 inch Laptop Bag/ Backpack', price: 'ksh. 1200', quanity: '1'},
        {img: Bag, desc: 'Half Moon 35L Water Resistant 15.6 inch Laptop Bag/ Backpack', price: 'ksh. 1200', quanity: '1'}
    ]
    return (
        <div className='body bg-[#edffe2] h-[100vh] flex flex-row items-center px-[8rem]'>
            <div className='leftBody w-1/2 h-[100%] flex flex-col px-[3rem] pt-10 '>
                <button className='back flex flex-row items-center justify-end gap-2'>
                    <AiOutlineArrowLeft size={20}/>
                    <span>Go back</span>
                </button>
                <h1 className='title font-bold text-[2.5rem]'>
                    Check Out.
                </h1>
                <small className='explanation text-[1rem] font-normal'>
                    Please checkout by providing your payment methods
                </small>
                <div className='container flex flex-col gap-y-5 mt-5'>
                    <div className='methods flex flex-row justify-between'>
                        <button className='button rounded-md hover:bg-[#ffffff]'>
                            <img
                                src={mpesa}
                                width={100}
                                className='mpesa'
                            />
                        </button>
                        <button className='button rounded-md hover:bg-[#ffffff]'>
                            <img
                                src={masterCard}
                                width={105}
                                className='mpesa'

                            />
                        </button>
                        <button className='button rounded-md hover:bg-[#ffffff]'>
                            <img
                                src={paypal}
                                width={125}
                                className='mpesa'

                            />
                        </button>
                    </div>
                    <form className='form flex flex-col'>

                        <label className='label flex flex-col text-[13px] mb-3'>
                            Payment Method
                            <select defaultValue="lipa" className='select p-2.5 outline-none mt-1'>
                                <option value="lipa">Lipa na Mpesa(Till)</option>
                                <option value="paybill">Paybill</option>
                            </select>
                        </label>

                        <label className='label flex flex-col text-[13px] mb-3'>
                            Phone Number
                            <input
                                type='tel'
                                value={form.phone}
                                onChange={(e) => setForm({...form, phone: e.target.value})}
                                editable={editable}
                                onFocus={() => setEmpty(false)}
                                className='input outline-none p-2.5 rounded-sm mt-1'
                            />
                        </label>

                        <label className='label flex flex-col text-[13px] mb-3'>
                            Email Address
                            <input
                                type='email'
                                value={form.email}
                                onChange={(e) => setForm({...form, email: e.target.value})}
                                editable={editable}
                                onFocus={() => setEmpty(false)}
                                className='input outline-none p-2.5 mt-1'
                            />
                        </label>
                        { empty && <small className='error text-[13px] text-red-600'>Please provide your information to complete the transaction </small>}
                        <button onClick={handleSubmit} className='button bg-[#136207] flex flex-row items-center justify-center p-3 w-[15rem] my-5 rounded-md text-[1rem] font-semibold text-white ml-[48%]'>
                            Pay Now
                            { <TailSpin height={20} width={40} ariaLabel="tail-spin-loading" radius="5" visible={loading}/> }
                        </button>
                    </form>
                </div>
            </div>
            <div className='rightBody w-1/2 h-[100%] flex flex-col px-[6rem] pt-10 gap-5 '>
                <div className='container rounded-xl border-[1px] p-2 border-[#afff8a] '>
                    <h4 className='summary font-bold'>Order Summary</h4>
                    <hr className='hr text-3xl mt-2 text-[#afff8a] font-bold '/>
                    {Products.map((items, index) => (
                        <Product
                            key={index}
                            image={items.img}
                            Description={items.desc}
                            Price={items.price}
                            Quantity={items.quanity}
                        />
                    ))}
                    <table className='table w-full'>
                        <tr className='tabelRow flex flex-row w-full justify-between text-sm'>
                            <td>Subtotal</td>
                            <td>ksh. 2400</td>
                        </tr>
                        <tr className='tableRow w-full flex flex-row items-center justify-between text-sm'>
                            <td>VAT (15%)</td>
                            <td>ksh. 360</td>
                        </tr>
                        <tr className='tableRow w-full flex flex-row items-center justify-between text-sm'>
                            <td>Delivery Fee</td>
                            <td>ksh. 120</td>
                        </tr>
                        <hr className='hr mt-2 mb-3'/>
                        <tr className='tableRow w-full flex flex-row items-center justify-between font-bold'>
                            <td>Total</td>
                            <td>ksh. 2880</td>
                        </tr>
                    </table>

                </div>
                <div className='container rounded-xl border-[1px] p-2 border-[#afff8a] '>
                    <h4 className='summary font-bold'>Delivery Address</h4>
                    <hr className='hr text-3xl mt-2 text-[#afff8a] font-bold '/>
                    <table>
                        <tr><small>282 Legros Passage</small></tr>
                        <tr><small>Nairobi</small></tr>
                        <tr><small>Mississipi</small></tr>
                        <tr><small>30130</small></tr>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default App