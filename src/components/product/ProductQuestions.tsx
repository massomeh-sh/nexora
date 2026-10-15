import {type JSX, useState} from 'react';
import {useAppSelector} from "../../hooks/useAppSelector.ts";
import {useNavigate} from "react-router";

function ProductQuestions(): JSX.Element {
    const [questionText, setQuestionText] = useState<string>("");
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const navigate = useNavigate();

    const handleAddQuestion = () => {
        if (isAuthenticated) {
            console.log(questionText);
            setQuestionText('')
        } else {
            navigate("/auth");
        }
    }

    return (
        <div className="flex flex-col">
            <h3 className="text-lg max-lg:text-[16px]">درباره این کالا چه پرسشی دارید؟</h3>
            <textarea maxLength={100} rows={2} value={questionText} onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="به این سوال پاسخ دهید"
                      className="resize-none outline-none rounded-lg p-5 border-2 border-light-gray text-dark-gray mt-3"/>
            <span className="mt-1 text-dark-gray text-sm">
                {`100/${questionText.length}`}
            </span>
            <div className="flex items-center max-md:flex-col justify-between mt-6 max-md:gap-5">
                <p className="text-dark-gray text-sm text-center tracking-widest max-md:self-start">ثبت این دیدگاه به معنی
                    موافقت
                    با <span
                        className="text-primary-blue">قوانین نکسورا</span>است.
                </p>
                <button onClick={handleAddQuestion} disabled={questionText.length < 7}
                        className={`text-white px-3 py-2 rounded-lg cursor-pointer max-md:self-end ${questionText.length < 7 ? "bg-light-gray" : "bg-primary-blue"}`}>ثبت
                    پرسش
                </button>
            </div>
        </div>
    );
}

export default ProductQuestions;