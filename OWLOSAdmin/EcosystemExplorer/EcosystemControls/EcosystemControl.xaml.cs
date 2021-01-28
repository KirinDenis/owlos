using OWLOSAdmin.Ecosystem;
using OWLOSAdmin.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OWLOSAdmin.EcosystemExplorer
{
    /// <summary>
    /// Interaction logic for EcosystemControl.xaml
    /// </summary>
    public partial class EcosystemControl : UserControl
    {
        private IEcosystemChildControl childControl = null;

        private DependencyPropertyDescriptor renderTransform = DependencyPropertyDescriptor.FromProperty(RenderTransformProperty, typeof(UserControl));

        private bool isInDrag = false;

        private Point currentPoint;

        private Point anchorPoint;

        public double resizeArea = 20.0f;
        public TranslateTransform transform { get; } = new TranslateTransform();

        public event EventHandler OnPositionChanged;

        private static EcosystemControl CurrentFocused;

        private bool _isFocused;

        public bool isVisible = true;

        private Point ResizePoint;
        public bool IsFocused
        {
            get { return _isFocused; }
            private set
            {
                _isFocused = value;
                if (_isFocused)
                {
                    childControl?.OnParentGetFocus();
                    Dispatcher.Invoke((Action)(() =>
                    {
                        {
                            FrameworkElement frameworkElement = Mouse.DirectlyOver as FrameworkElement;
                            Type directlyOverType = frameworkElement?.GetType();
                            if (directlyOverType == null || (directlyOverType.Name != "TextBoxView" &&
                                                             directlyOverType != typeof(Slider) &&
                                                             directlyOverType != typeof(Button) &&
                                                             directlyOverType != typeof(CheckBox) &&
                                                             directlyOverType != typeof(ComboBox) &&
                                                             directlyOverType != typeof(Slider) &&
                                                             directlyOverType != typeof(ScrollViewer) &&
                                                             directlyOverType != typeof(ScrollBar) &&
                                                             directlyOverType != typeof(TextBox) &&
                                                             directlyOverType != typeof(Border)))
                            {

                            }
                        }

                        //Перемещаем текущий object вниз списка, тем самым делая его главнее.
                        if (Parent is Panel panel)
                        {
                            //    Unloaded -= UserControl_Unloaded;
                            panel.Children.Remove(this);
                            panel.Children.Add(this);
                            //   Unloaded += UserControl_Unloaded;
                        }
                    }
                    ));
                }
                else
                {
                    childControl?.OnParentLostFocus();
                    Dispatcher.Invoke((Action)(() =>
                    {
                        //  if ((treeViewItem != null) && treeViewItem.IsSelected)
                        //  {
                        //      treeViewItem.IsSelected = false;
                        //  }
                    }
                    ));
                }

                if (CurrentFocused != null
                    && CurrentFocused != this
                    && CurrentFocused.IsFocused
                    && IsFocused)
                {
                    CurrentFocused.IsFocused = false;
                    CurrentFocused = this;
                }
                else
                {
                    CurrentFocused = this;
                }
            }
        }
       
        public EcosystemControl(IEcosystemChildControl childControl)
        {
            InitializeComponent();

            if (childControl != null)
            {
                this.childControl = childControl;
                childHolderGrid.Children.Add(childControl as UserControl);
            }

            MoveTransform(5000, 5000);

            childControl?.OnParentLostFocus();
        }

        public void Show()
        {
            isVisible = true;
            ColorAnimation animation;
            animation = new ColorAnimation();
            animation.To = (new BrushConverter().ConvertFromString("#FFFFFFFF") as SolidColorBrush).Color;
            animation.Duration = new Duration(TimeSpan.FromSeconds(1));
            this.OpacityMask = new BrushConverter().ConvertFromString("#00FFFFFF") as SolidColorBrush;
            this.OpacityMask.BeginAnimation(SolidColorBrush.ColorProperty, animation);
        }

        public void Hide()
        {
            isVisible = false;
            ColorAnimation animation;
            animation = new ColorAnimation();
            animation.To = (new BrushConverter().ConvertFromString("#00FFFFFF") as SolidColorBrush).Color;
            animation.Duration = new Duration(TimeSpan.FromSeconds(1));            
            this.OpacityMask = new BrushConverter().ConvertFromString("#FFFFFFFF") as SolidColorBrush;
            this.OpacityMask.BeginAnimation(SolidColorBrush.ColorProperty, animation);
        }


        public void MoveTransform(double x, double y)
        {
            transform.X = x;
            transform.Y = y;
            renderTransform.AddValueChanged(this, EcosystemControlPositionChanged);
            this.RenderTransform = transform;
        }
        public void EcosystemControlPositionChanged(object sender, EventArgs e)
        {
            OnPositionChanged?.Invoke(sender, e);
        }

        private void EcosystemControlPreviewMouseMove(object sender, MouseEventArgs e)
        {
            if (isInDrag)
            {
                //this.Margin = new Thickness(e.GetPosition(Parent as Grid).X - clickLocalPosition.X, e.GetPosition(Parent as Grid).Y - clickLocalPosition.Y, 0, 0);
                currentPoint = e.GetPosition(Parent as Grid);
                Point localPoint = e.GetPosition(this);

                //drag or resize 
                if ((localPoint.X > resizeArea) && (localPoint.Y > resizeArea) && (Width - localPoint.X > resizeArea) && (Height -  localPoint.Y > resizeArea))
                {
                    transform.X += (currentPoint.X - anchorPoint.X);
                    transform.Y += (currentPoint.Y - anchorPoint.Y);
                    this.RenderTransform = transform;
                }
                else
                {                 
                    Width = ActualWidth + (currentPoint.X - anchorPoint.X);
                    Height = ActualHeight + (currentPoint.Y - anchorPoint.Y);
                }

                anchorPoint = currentPoint;

                //временно
                //((((Parent as Grid).Parent as Grid).Parent as Viewbox).Parent as ScrollViewer).ScrollToVerticalOffset(transform.Y);
                //connectionLine.X2 = e.GetPosition(Parent as Grid).X - clickLocalPosition.X;
                //connectionLine.Y2 = e.GetPosition(Parent as Grid).Y - clickLocalPosition.Y;
            }
        }

        private void EcosystemControlMouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                FrameworkElement frameworkElement = Mouse.DirectlyOver as FrameworkElement;
                Type directlyOverType = frameworkElement?.GetType();
                if (directlyOverType == null || (directlyOverType.Name != "TextBoxView" &&
                                                 directlyOverType != typeof(Slider) &&
                                                 directlyOverType != typeof(Button) &&
                                                 directlyOverType != typeof(CheckBox) &&
                                                 directlyOverType != typeof(ComboBox) &&
                                                 directlyOverType != typeof(Slider) &&
                                                 directlyOverType != typeof(ScrollViewer) &&
                                                 directlyOverType != typeof(ScrollBar) &&
                                                 directlyOverType != typeof(TextBox)))
                {


                    anchorPoint = e.GetPosition(Parent as Grid);
                    this.CaptureMouse();
                    isInDrag = true;


                }
            }

        }

        private void EcosystemControlMouseUp(object sender, MouseButtonEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Released)
            {
                if (isInDrag)
                {
                    this.ReleaseMouseCapture();
                    isInDrag = false;
                }
            }
        }

        private void EcosystemControlGotFocus(object sender, RoutedEventArgs e)
        {
            IsFocused = true;
        }

        private void EcosystemControlLostFocus(object sender, RoutedEventArgs e)
        {
            IsFocused = false;
        }

        private void EcosystemControlPreviewMouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                ResizePoint = e.GetPosition(Parent as Grid);
                EcosystemControlGotFocus(this, null);
              //  EcosystemControlMouseDown(this, e);
            }
        }
    }
}
