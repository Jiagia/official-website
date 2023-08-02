export function meta(parentsData){
    // console.log(parentsData.matches[0].data.header.shop.description);
    return [
        {title: 'Products - JIAGIA'},
        {description: parentsData.matches[0].data.header.shop.description + " - Exhibition"},
        {
            property: "og:description",
            content: parentsData.matches[0].data.header.shop.description
        },
    ];
};

export default function Exhibition() {
    return (
        <div>
            Exhibition
        </div>
    )
}