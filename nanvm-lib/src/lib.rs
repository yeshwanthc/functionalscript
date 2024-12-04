/// Future optimization: `fn to_mut(self) -> Option<Mut<Self>>`
pub mod interface {
    pub enum Sign {
        Positive = 1,
        Negative = -1,
    }

    pub trait VarSize: Sized {
        type Header;
        type Item;
        fn new(h: Self::Header, c: impl IntoIterator<Item = Self::Item>) -> Option<Self>;
        fn header(&self) -> &Self::Header;
        fn items(&self) -> &[Self::Item];
    }

    pub trait String: VarSize<Header = (), Item = u16> {}

    pub trait BigInt: VarSize<Header = Sign, Item = u64> {}

    pub trait Object: VarSize<Header = (), Item = (<Self::Any as Any>::String, Self::Any)> {
        type Any: Any<Object = Self>;
    }

    pub trait Array: VarSize<Header = (), Item = Self::Any> {
        type Any: Any<Array = Self>;
    }

    pub trait Function: VarSize<Header = u32, Item = u8> {}

    pub trait Any {
        type String: String;
        type Object: Object;
        type Array: Array;
        type BitInt: BigInt;
        type Function: Function;
    }
}

/// Naive implementation of VM.
pub mod naive {
    use std::rc;

    use crate::interface::{self, Sign};

    pub struct Rc<H, T> {
        header: H,
        items: rc::Rc<[T]>,
    }

    impl<H, T> interface::VarSize for Rc<H, T> {
        type Header = H;
        type Item = T;
        fn new(header: H, s: impl IntoIterator<Item = T>) -> Option<Self> {
            Some(Self {
                header,
                items: rc::Rc::from_iter(s),
            })
        }
        fn header(&self) -> &Self::Header {
            &self.header
        }
        fn items(&self) -> &[Self::Item] {
            &self.items
        }
    }

    pub type String = Rc<(), u16>;

    pub type BigInt = Rc<Sign, u64>;

    type Object = Rc<(), (String, Any)>;

    type Array = Rc<(), Any>;

    type Function = Rc<u32, u8>;

    pub enum Any {
        String(String),
        BigInt(BigInt),
        Array(Array),
        Object(Object),
        Function(Function),
    }
}

#[cfg(test)]
mod test {
    use crate::{
        interface::{Sign, VarSize},
        naive,
    };

    #[test]
    fn test() {
        let s = naive::String::new((), b"Hello".map(|v| v as u16));
        let bi = naive::BigInt::new(Sign::Positive, []);
    }
}
