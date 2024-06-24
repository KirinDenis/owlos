using System;
using System.ComponentModel;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;

namespace OWLOSThingsManager.EcosystemExplorer
{
    /// <summary>
    /// Interaction logic for EcosystemControl.xaml
    /// </summary>
    public partial class EcosystemControl : UserControl
    {
        /*
        private OWLOSWindow _window = null;
        //когда панель принадлежит отдельному окну
        public OWLOSWindow window
        {
            get => _window;
            set
            {
                _window = value;
                if (_window == null)
                {
                    OnEcosystem?.Invoke(this, new EventArgs());
                }
                else
                {
                    OnWindow?.Invoke(this, new EventArgs());
                }
            }

        }
        */
        //когда панель принадлежит окну экосистемы (сюда сохраняестя Parent для экосистемы)
        public Grid parentGrid = null;

        public Transform storedRenderTransform = null;

        private readonly IEcosystemChildControl childControl = null;

        private readonly DependencyPropertyDescriptor renderTransform = DependencyPropertyDescriptor.FromProperty(RenderTransformProperty, typeof(UserControl));

        private bool isInDrag = false;

        private Point currentPoint;

        private Point anchorPoint;

        public double resizeArea = 20.0f;
        public TranslateTransform transform { get; } = new TranslateTransform();

        
        private static EcosystemControl CurrentFocused;

        private bool _isFocused;

        private bool _isVisible = false;
        public bool isVisible
        {
            get => _isVisible;
            set
            {
                _isVisible = value;
                if (value)
                {
                    OnShow?.Invoke(this, new EventArgs());
                }
                else
                {
                    OnHiden?.Invoke(this, new EventArgs());
                }
            }
        }

        private readonly bool lockMove = false;

        private Point ResizePoint;

        public event EventHandler OnPositionChanged;
        public event EventHandler OnShow;
        public event EventHandler OnHiden;
        public event EventHandler OnWindow;
        public event EventHandler OnEcosystem;

        public bool IsFocused
        {
            get => _isFocused;
            private set
            {
                _isFocused = value;
                if (_isFocused)
                {
                    childControl?.OnParentGetFocus();
                    Dispatcher.Invoke(() =>
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
                    );
                }
                else
                {
                    childControl?.OnParentLostFocus();
                    Dispatcher.Invoke(() =>
                    {
                        //  if ((treeViewItem != null) && treeViewItem.IsSelected)
                        //  {
                        //      treeViewItem.IsSelected = false;
                        //  }
                    }
                    );
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
            animation = new ColorAnimation
            {
                To = (new BrushConverter().ConvertFromString("#FFFFFFFF") as SolidColorBrush).Color,
                Duration = new Duration(TimeSpan.FromSeconds(1))
            };
            OpacityMask = new BrushConverter().ConvertFromString("#00FFFFFF") as SolidColorBrush;
            OpacityMask.BeginAnimation(SolidColorBrush.ColorProperty, animation);
        }

        public void Hide()
        {
            isVisible = false;
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = (new BrushConverter().ConvertFromString("#00FFFFFF") as SolidColorBrush).Color,
                Duration = new Duration(TimeSpan.FromSeconds(1))
            };
            OpacityMask = new BrushConverter().ConvertFromString("#FFFFFFFF") as SolidColorBrush;
            OpacityMask.BeginAnimation(SolidColorBrush.ColorProperty, animation);
        }


        public void MoveTransform(double x, double y)
        {
            transform.X = x;
            transform.Y = y;
            renderTransform.AddValueChanged(this, EcosystemControlPositionChanged);
            RenderTransform = transform;
        }
        public void EcosystemControlPositionChanged(object sender, EventArgs e)
        {
            OnPositionChanged?.Invoke(sender, e);
        }

        private void EcosystemControlPreviewMouseMove(object sender, MouseEventArgs e)
        {
            if (window == null)
            {
                if (isInDrag)
                {
                    //this.Margin = new Thickness(e.GetPosition(Parent as Grid).X - clickLocalPosition.X, e.GetPosition(Parent as Grid).Y - clickLocalPosition.Y, 0, 0);
                    currentPoint = e.GetPosition(Parent as Grid);
                    Point localPoint = e.GetPosition(this);

                    if (double.IsNaN(Width))
                    {
                        Width = ActualWidth;
                    }

                    if (double.IsNaN(Height))
                    {
                        Height = ActualHeight;
                    }


                    //drag or resize 
                    if ((localPoint.X > resizeArea) && (localPoint.Y > resizeArea) && (Width - localPoint.X > resizeArea) && (Height - localPoint.Y > resizeArea))
                    {
                        //OWLOSWindow has drag itself
                        if (window == null)
                        {
                            transform.X += (currentPoint.X - anchorPoint.X);
                            transform.Y += (currentPoint.Y - anchorPoint.Y);
                            RenderTransform = transform;
                        }
                    }
                    else
                    {
                        if (window == null)
                        {
                            try
                            {
                                Width = ActualWidth + (currentPoint.X - anchorPoint.X);
                                Height = ActualHeight + (currentPoint.Y - anchorPoint.Y);
                            }
                            catch
                            { }
                        }
                    }

                    anchorPoint = currentPoint;

                }
            }
        }

        private void EcosystemControlMouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                if (window == null)
                {

                    FrameworkElement frameworkElement = Mouse.DirectlyOver as FrameworkElement;
                    Type directlyOverType = frameworkElement?.GetType();
                    if (directlyOverType == null || (directlyOverType.Name != "TextBoxView" &&
                                                     directlyOverType != typeof(Slider) &&
                                                     directlyOverType != typeof(Button) &&
                                                     directlyOverType != typeof(CheckBox) &&
                                                     directlyOverType != typeof(ComboBox) &&
                                                     directlyOverType != typeof(Slider) &&
                                                     //directlyOverType != typeof(ScrollViewer) &&
                                                     directlyOverType != typeof(ScrollBar) &&
                                                     directlyOverType != typeof(TextBox)))
                    {
                        anchorPoint = e.GetPosition(Parent as Grid);

                        
                        CaptureMouse();
                        
                        isInDrag = true;
                    }
                }
                else
                {
                    window.DragMove();
                }
            }

        }

        private void EcosystemControlMouseUp(object sender, MouseButtonEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Released)
            {
                if (isInDrag)
                {
                    ReleaseMouseCapture();
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

               // EcosystemControlMouseDown(this, e);


            }
        }

        private void SwitchFromPanelToWindow()
        {
            /*
            if (window == null)
            {
                window = new OWLOSWindow
                {
                    Width = ActualWidth,
                    Height = ActualHeight
                };
                storedRenderTransform = RenderTransform;
                //сразу после этого Parent уходит в null
                parentGrid = (Parent as Grid);
                (Parent as Grid).Children.Remove(this);
                window.MainGrid.Children.Add(this);
                RenderTransform = null;
                HorizontalAlignment = HorizontalAlignment.Stretch;
                VerticalAlignment = VerticalAlignment.Stretch;


                Show();
                window.Show();
            }
            */
        }

        private void SwitchFromWindowToPanel()
        {
            window.MainGrid.Children.Remove(this);
            parentGrid.Children.Add(this);
            RenderTransform = storedRenderTransform;
            HorizontalAlignment = HorizontalAlignment.Left;
            VerticalAlignment = VerticalAlignment.Top;

            Show();
            window.Hide();
            window = null;

        }

        private void SwitchWindowTransparentButton_Click(object sender, RoutedEventArgs e)
        {
            if (window != null)
            {
                if (window.Background == null)
                {
                    window.Background = (SolidColorBrush)App.Current.Resources["OWLOSDark"];
                }
                else
                {
                    window.Background = null;
                }
            }
        }


        private void SwitchWindowButton_Click(object sender, RoutedEventArgs e)
        {
            if (window == null)
            {
                SwitchFromPanelToWindow();
            }
            else
            {
                SwitchFromWindowToPanel();
            }
        }

        private void CloseButton_Click(object sender, RoutedEventArgs e)
        {
            if (window == null)
            {
                Hide();
            }
            else
            {
                SwitchFromWindowToPanel();
                Hide();
            }
        }
    }
    }
