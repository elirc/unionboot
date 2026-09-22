// W478: Sparse fieldset projection / Default fields price and stock
namespace DotnetWeb;
public static class W478{
public sealed record Item(int Id,string Title,decimal Price,int Stock);
public static IResult Project(Item item,string? fields){throw new NotImplementedException("W478");}
}
