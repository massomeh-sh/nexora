import type {JSX} from 'react';

function ProductEmptyReview(): JSX.Element {
    return (
        <div className="flex flex-col text-center">
            <h4>شما هم میتوانید در مورد این کالا نظر دهید.</h4>
            <p className="text-sm text-dark-gray">اگر این محصول را قبلا از نکسورا خریده باشید،
                دیدگاه شما به عنوان خریدار ثبت خواهد شد.
                همچنین در صورت تمایل میتوانید به صورت ناشناس نیز دیدگاه خود را ثبت کنید.</p>
        </div>
    );
}

export default ProductEmptyReview;