import React, { useRef } from 'react';
import { useFormik } from 'formik';
import { deleteData, save as saveData } from '../utils/store';
import Field from './Field';


const PaymentForm = ({ onSubmit:handleSubmit }) => {

    const nameRef = useRef();

    const formik = useFormik({
        initialValues: { name: '', amount: '' },
        onSubmit: values => { // not using this.
            handleSubmit(values)
        },
        validate: values => {
            const errors = {};
            if (!values.name) {
                errors.name = 'Required';
            }
            if (!values.amount) {
                errors.amount = "Required";
            }
            return errors;
        }
    });

    const deleteByInput = ()=>{
        const element = nameRef.current;

        if (!element) return;

        const name = element.value;

        if (!Boolean(name)) return;

        deleteData(name);

        formik.resetForm();
    }

    formik.handleSubmit = (e)=>{
        e.preventDefault();
        const name = e.target.name.value;
        const amount = e.target.amount.value;

        saveData({name, amount}).catch((err)=>{
            console.log("Could not save data");
            console.error(err);
        });

        formik.resetForm();
    }



    return (
        <div className='bg-slate-500 mx-2 rounded'>
            <form onSubmit={formik.handleSubmit} onReset={formik.resetForm}>
                <div className='flex justify-center'>
                    <div className='flex flex-col gap-y-2 w-[60%] p-4'>
                        <div className='mb-4'>
                            <h2 className="text-left text-base font-semibold leading-7 text-gray-900">Administrador!</h2>
                            <p className="text-left mt-1 text-sm leading-6 text-gray-600">Esto solo es accesible para el administrador.</p>
                        </div>
                        <div className='flex flex-col gap-y-3 text-left'>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>Nombre</label>
                            <Field
                                type="name" name="name"
                                getRef={()=> nameRef}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                                meta = {
                                    {
                                        touched: formik.touched.name,
                                        error: formik.errors.name
                                    }
                                }
                                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:pl-3 pl-3 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 w-[60%]'
                            />
                        </div>
                        <div className='flex flex-col gap-y-3 text-left'>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>Cantidad($)</label>
                            <Field 
                                type="amount" name="amount"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.amount}
                                meta = {
                                    {
                                        touched: formik.touched.amount,
                                        error: formik.errors.amount
                                    }
                                }
                                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:pl-3 pl-3 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 w-[60%]'
                            />
                        </div>

                        {/* Call to actions */}
                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <button
                                type="button"
                                onClick={()=>formik.resetForm()}
                                className="text-sm font-semibold leading-6 text-gray-900"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                onClick={deleteByInput}
                            >
                                Borrar
                            </button>
                            <button 
                                type="submit" 
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Ahorrar
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>        
    )
}

export default PaymentForm