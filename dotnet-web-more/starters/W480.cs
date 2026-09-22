// W480: Sparse fieldset projection / Default fields id and title and price and stock
namespace DotnetWeb;
public static class W480{
public sealed record Item(int Id,string Title,decimal Price,int Stock);
public static IResult Project(Item item,string? fields){throw new NotImplementedException("W480");}
}
