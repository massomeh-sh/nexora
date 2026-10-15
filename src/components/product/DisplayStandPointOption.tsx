import {type JSX} from 'react';
import {standPointOptions} from "../../constants/standPointOptions.ts";
import type {StandOption} from "../../types/standOption.ts";


interface ReviewDisplayStandPointOptionProps {
    selectedOption: string;
    setSelectedOption: (selectedOption: string) => void;
}


function ReviewDisplayStandPointOption({
                                           selectedOption,
                                           setSelectedOption
                                       }: ReviewDisplayStandPointOptionProps): JSX.Element {
    return (
        <div className="p-5 flex flex-col gap-5">
            {standPointOptions.map((option: StandOption) => {
                    return (
                        <label key={option.id} className='flex items-start gap-3 cursor-pointer'>
                            <input type="radio" name="review-display" value={option.id}
                                   checked={selectedOption === option.id}
                                   onChange={() => setSelectedOption(option.id)}
                                   className="mt-1 size-6 shrink-0 accent-blue-600"/>
                            <div className="flex-1"><h3 className="font-semibold text-black"> {option.title} </h3> <p
                                className="mt-2 text-sm leading-6 text-gray-500"> {option.description} </p></div>

                        </label>
                    )
                }
            )}
        </div>
    );
}

export default ReviewDisplayStandPointOption;