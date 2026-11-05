import {type JSX} from "react";
import {Iran} from "provinces-and-cities";
import {BiChevronDown} from "react-icons/bi";
import {type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue, useWatch} from "react-hook-form";
import type {FormFields} from "@/pages/Checkout.tsx";

const provinces = Iran.main;

interface AddressSelectsProps {
    register: UseFormRegister<FormFields>;
    control: Control<FormFields>;
    setValue: UseFormSetValue<FormFields>;
    errors: FieldErrors<FormFields>;
}


export default function AddressSelects({register, control, setValue, errors}: AddressSelectsProps): JSX.Element {
    const province = useWatch({control, name: "province"});
    const cities = provinces.find((p) => p.name === province)?.cities ?? [];

    return (
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 col-span-2 max-md:col-span-1 max-md:text-sm">
            <div className="flex flex-col gap-1.5 relative">
                <label htmlFor="province">استان</label>
                <select {...register("province", {
                    onChange: () => setValue("city", "")
                })} id="province"
                        className="appearance-none border max-md:placeholder:text-[12px] focus:bg-light-gray focus:ring-3 focus:ring-primary-blue/70 focus:border-primary-blue text-dark-gray border-gray-300 rounded-lg relative w-full px-4 py-3 outline-none"
                >
                    <option value="">انتخاب استان</option>
                    {provinces.map((p) => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                </select>
                <BiChevronDown
                    size={18}
                    className="pointer-events-none absolute left-3 top-15 max-md:top-12.5 -translate-y-1/2 text-gray-500"
                />
                {errors?.province && <p className="text-sm max-md:text-[12px] text-primary-red mt-1">{errors?.province?.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5 relative">
                <label htmlFor="city">شهر</label>
                <select id="city" {...register("city")}
                        className="appearance-none border max-md:placeholder:text-[12px] focus:bg-light-gray focus:ring-3 focus:ring-primary-blue/70 focus:border-primary-blue text-dark-gray border-gray-300 rounded-lg relative w-full px-4 py-3 outline-none"
                        disabled={!province}>
                    <option value="">انتخاب شهر</option>
                    {cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                <BiChevronDown
                    size={18}
                    className="pointer-events-none absolute left-3 top-15 max-md:top-12.5 -translate-y-1/2 text-gray-500"
                />
                {errors?.city && <p className="text-sm max-md:text-[12px] text-primary-red mt-1">{errors?.city?.message}</p>}
            </div>

        </div>
    );
}