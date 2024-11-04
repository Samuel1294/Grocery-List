export const getFormErrors = ({name, quantity, price}) => {
    return {
        name: !name,
        quantity: !quantity || quantity < 1,
        price: !price || price <= 0
    }
}